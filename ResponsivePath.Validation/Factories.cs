using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResponsivePath.Validation
{
    /// <summary>
    /// A set of assignable factories with default values - this is so you can override our construction with whatever DI you want to use.
    /// </summary>
    public static class Factories
    {
        private static Func<IValidationService> buildValidationService;
        private static Func<object, ValidationContext> buildValidationContext;

        static Factories()
        {
            buildValidationService = DefaultBuildValidationService;
            buildValidationContext = DefaultBuildValidationContext;
        }

        public static Func<IValidationService> BuildValidationService
        {
            get
            {
                return buildValidationService;
            }
            set
            {
                if (value == null)
                    throw new ArgumentNullException();
                buildValidationService = value;
            }
        }

        public static Func<object, ValidationContext> BuildValidationContext
        {
            get
            {
                return buildValidationContext;
            }
            set
            {
                if (value == null)
                    throw new ArgumentNullException();
                buildValidationContext = value;
            }
        }

        private static IValidationService DefaultBuildValidationService()
        {
            return new ValidationService();
        }

        private static ValidationContext DefaultBuildValidationContext(object instance)
        {
            return new ValidationContext(instance);
        }
    }
}
