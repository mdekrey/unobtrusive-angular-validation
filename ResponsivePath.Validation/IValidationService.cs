using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Text;

namespace ResponsivePath.Validation
{
    public interface IValidationService
    {
        IEnumerable<ValidationResult> CompleteValidate<T>(T target);

        IEnumerable<ValidationResult> PartialValidate<T>(T target, params Expression<Func<T, object>>[] properties);
    }
}
