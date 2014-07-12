using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace ResponsivePath.Validation
{
    public class CompositeValidationResult : ValidationResult, IEnumerable<ValidationResult>
    {
        public IEnumerable<ValidationResult> Results
        {
            get;
            private set;
        }

        public CompositeValidationResult(IEnumerable<ValidationResult> results, string errorMessage, IEnumerable<string> memberNames) : base(errorMessage, memberNames)
        {
            Results = results;
        }

        IEnumerator<ValidationResult> IEnumerable<ValidationResult>.GetEnumerator()
        {
            return Results.GetEnumerator();
        }

        System.Collections.IEnumerator System.Collections.IEnumerable.GetEnumerator()
        {
            return Results.GetEnumerator();
        }
    }
}
