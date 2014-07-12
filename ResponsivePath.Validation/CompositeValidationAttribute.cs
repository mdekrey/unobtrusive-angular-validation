using ResponsivePath.Validation.Extensions;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;

namespace ResponsivePath.Validation
{
    public class CompositeValidationAttribute : ValidationAttribute
    {
        public CompositeValidationAttribute()
        {
        }

        public string ErrorMessagePrefix { get; set; }

        protected ValidationResult ResultFromInnerResults(IEnumerable<Tuple<string, ValidationResult>> innerResults, string memberName)
        {
            var results = from entry in innerResults
                          let result = entry.Item2
                          select new ValidationResult(result.ErrorMessage.Prefix(ErrorMessagePrefix),
                                                             (from member in result.MemberNames
                                                              select member.Prefix(entry.Item1 + ".")).ToArray());

            results = results.ToArray();

            if (results.Any())
            {
                return new CompositeValidationResult(results, ErrorMessageString, new[] { memberName });
            }
            return ValidationResult.Success;
        }

        public static string GetPrefix(IEnumerable<System.Reflection.MemberInfo> propertyChain)
        {
            return string.Join("", (from p in propertyChain
                                    from a in p.GetCustomAttributes<CompositeValidationAttribute>()
                                    select a.ErrorMessagePrefix));
        }

        public static IEnumerable<MemberInfo> UnrollPropertyChain(MemberExpression expression)
        {
            var members = new Stack<MemberInfo>();
            while (expression != null)
            {
                members.Push(expression.Member);
                expression = expression.Expression.RemoveCast() as MemberExpression;
            }
            return members.ToArray();
        }

        public static string GetPathedName(IEnumerable<MemberInfo> propertyChain)
        {
            return string.Join(".", propertyChain.Select(mi => mi.Name));
        }
    }
}
