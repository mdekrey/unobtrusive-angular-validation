using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections;
using ResponsivePath.Validation.Extensions;

namespace ResponsivePath.Validation
{
    public class ValidateEnumerableAttribute : CompositeValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value != null)
            {
                var memberName = validationContext.MemberName;
                if (value is IDictionary)
                {
                    var entries = ((IDictionary)value).Keys.OfType<object>().Select((obj, index) => new { obj, extra = "Key", index })
                        .Concat(((IDictionary)value).Values.OfType<object>().Select((obj, index) => new { obj, extra = "Value", index }));
                    var results = from entry in entries
                                  let context = Factories.BuildValidationContext(entry.obj)
                                  let innerResults = new HashSet<ValidationResult>()
                                  where !Validator.TryValidateObject(entry.obj, context, innerResults, true)
                                  from innerResult in innerResults.Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true)
                                  select Tuple.Create(memberName + "[" + entry.index + "]." + entry.extra, innerResult);

                    return ResultFromInnerResults(results, memberName);
                }
                else
                {
                    var results = from entry in ((IEnumerable)value).OfType<object>().Select((obj, index) => new { obj, index })
                                  let context = Factories.BuildValidationContext(entry.obj)
                                  let innerResults = new HashSet<ValidationResult>()
                                  where !Validator.TryValidateObject(entry.obj, context, innerResults, true)
                                  from innerResult in innerResults.Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true)
                                  select Tuple.Create(memberName + "[" + entry.index + "]", innerResult);

                    return ResultFromInnerResults(results, memberName);
                }
            }

            return ValidationResult.Success;
        }

        private static IValidationService GetValidationService(ValidationContext validationContext)
        {
            var service = ((IValidationService)validationContext.GetService(typeof(IValidationService)));
            if (service == null)
                service = Factories.BuildValidationService();
            return service;
        }

    }
}
