using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace ResponsivePath.Validation.Extensions
{
    public static class EnumerableExtensions
    {
        public static IEnumerable<T> Flatten<T>(this IEnumerable<T> initialList, Func<T, IEnumerable<T>> subList, bool leafNodesOnly = false)
        {
            if (initialList != null)
            {
                foreach (var entry in initialList)
                {
                    bool hasChild = false;
                    foreach (var entry2 in Flatten(subList(entry), subList, leafNodesOnly))
                    {
                        hasChild = true;
                        yield return entry2;
                    }
                    if (!hasChild || !leafNodesOnly)
                        yield return entry;
                }
            }
        }

        public static Func<IValidationService, IEnumerable<ValidationResult>> PartialValidate<T>(this IEnumerable<T> initialList, params Expression<Func<T, object>>[] properties)
        {
            if (initialList == null)
            {
                return delegate { return null; };
            }
            return (svc) =>
            {
                return from element in initialList.Select((value, index) => new { value, index })
                       from v in svc.PartialValidate(element.value, properties).Flatten(v => v as IEnumerable<ValidationResult>, leafNodesOnly: true)
                       select new ValidationResult(v.ErrorMessage, v.MemberNames.Select(n => "[" + element.index + "]" + n.Prefix(".")).ToArray());
            };
        }
    }
}
