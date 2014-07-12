using ResponsivePath.Validation.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ResponsivePath.Validation
{
    internal class ValidationService : IValidationService
    {
        public IEnumerable<ValidationResult> CompleteValidate<T>(T target)
        {
            var validationContext = Factories.BuildValidationContext(target);
            var validations = new HashSet<ValidationResult>();

            Validator.TryValidateObject(target, validationContext, validations, true);

            return validations.Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true);
        }

        public IEnumerable<ValidationResult> PartialValidate<T>(T target, params Expression<Func<T, object>>[] validationExpressions)
        {
            var validationContext = Factories.BuildValidationContext(target);
            var validations = new List<ValidationResult>();
            foreach (var validationExpression in validationExpressions)
            {
                Func<IEnumerable<ValidationResult>> validate;
                object value = TryGetValue(validationExpression.CachedCompile<Func<T, object>>(), target);
                var unwrappedExpression = validationExpression.RemoveLambdaBody().RemoveCast();
                string messagePrefix;
                string memberPrefix;
                MemberExpression property;
                MemberInfo[] propertyChain;
                if (unwrappedExpression is MemberExpression)
                {
                    property = (unwrappedExpression as MemberExpression);
                    propertyChain = CompositeValidationAttribute.UnrollPropertyChain(property).ToArray();
                    messagePrefix = CompositeValidationAttribute.GetPrefix(propertyChain.Take(propertyChain.Length - 1));
                    memberPrefix = "";
                    validate = () =>
                        {
                            var name = CompositeValidationAttribute.GetPathedName(propertyChain);
                            var attrs = property.Member.GetCustomAttributes(true).OfType<ValidationAttribute>();
                            validationContext.MemberName = name;
                            var innerValidations = new HashSet<ValidationResult>();
                            Validator.TryValidateValue(value, validationContext, innerValidations, attrs);

                            return innerValidations;
                        };
                }
                else if (unwrappedExpression is MethodCallExpression)
                {
                    Func<IValidationService, IEnumerable<ValidationResult>> delegatedValidation = (Func<IValidationService, IEnumerable<ValidationResult>>)value;
                    var exp = (unwrappedExpression as MethodCallExpression);
                    property = (exp.Object ?? exp.Arguments[0]) as MemberExpression;
                    propertyChain = CompositeValidationAttribute.UnrollPropertyChain(property).ToArray();
                    messagePrefix = CompositeValidationAttribute.GetPrefix(propertyChain);
                    memberPrefix = CompositeValidationAttribute.GetPathedName(propertyChain);
                    var attrs = property.Member.GetCustomAttributes(true).OfType<RequiredAttribute>().FirstOrDefault();

                    validate = () =>
                        {
                            var result = delegatedValidation(this);
                            if (result != null)
                                return result;
                            if (attrs == null) 
                                return Enumerable.Empty<ValidationResult>();
                            messagePrefix = "";
                            memberPrefix = "";
                            return Enumerable.Repeat(new ValidationResult(attrs.ErrorMessage, new[] { CompositeValidationAttribute.GetPathedName(propertyChain) }), 1);
                        };
                }
                else if (unwrappedExpression == (validationExpression as LambdaExpression).Parameters[0])
                {
                    validations.AddRange(CompleteValidate(value));
                    continue;
                }
                else
                {
                    throw new NotSupportedException("Unsupported validation expression: " + validationExpression.ToString());
                }
                
                validations.AddRange(from v in validate().Flatten(v => v as IEnumerable<ValidationResult>, leafNodesOnly: true)
                                     select new ValidationResult(v.ErrorMessage.Prefix(messagePrefix), v.MemberNames.Select(n => n.Prefix(memberPrefix)).ToArray()));
            }
            return validations.Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true);
        }

        private object TryGetValue<T>(Func<T, object> func, T target)
        {
            try
            {
                return func(target);
            }
            catch
            {
                return null;
            }
        }

    }
}
