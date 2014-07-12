using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ResponsivePath.Validation.Extensions;

namespace ResponsivePath.Validation.Tests
{
    [TestClass]
    public class ValidateEnumerableAttributeTest
    {
        class DriversLicense
        {
            [Required(ErrorMessage = "Number Required")]
            [RegularExpression("^[0-9]+$", ErrorMessage = "Number Invalid")]
            public string Number { get; set; }

            [Required(ErrorMessage = "State Required")]
            [RegularExpression("[A-Z]{2}")]
            public string State { get; set; }
        }

        class Outer
        {
            [ValidateEnumerable(ErrorMessagePrefix="Licenses ")]
            public IEnumerable<DriversLicense> Licenses { get; set; }


            [ValidateEnumerable(ErrorMessagePrefix = "Licenses2 ")]
            public Dictionary<string, DriversLicense> Licenses2 { get; set; }
        }

        [TestMethod]
        public void IgnoreNullTest()
        {
            var target = new Outer();

            Validator.ValidateObject(target, new ValidationContext(target));
        }

        [TestMethod]
        public void InnerFields()
        {
            var validationService = new ValidationService();

            var target = new Outer()
            {
                Licenses = new [] {
                    new DriversLicense()
                    {
                        Number = "TX"
                    },
                    new DriversLicense()
                    {
                        State = "TX"
                    }
                }
            };

            try
            {
                Validator.ValidateObject(target, Factories.BuildValidationContext(target), true);
                Assert.Fail("Should have thrown an Exception.");
            }
            catch (ValidationException ex)
            {
                var results = (ex.ValidationResult as IEnumerable<ValidationResult>).Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true);

                Assert.IsTrue((from entry in results
                               from member in entry.MemberNames
                               select member + ": " + entry.ErrorMessage).SequenceEqual(new[] 
                                   { 
                                       "Licenses[0].Number: Licenses Number Invalid", 
                                       "Licenses[0].State: Licenses State Required", 
                                       "Licenses[1].Number: Licenses Number Required", 
                                   }));
            }
        }

        [TestMethod]
        public void InnerFieldsDictionary()
        {
            var validationService = new ValidationService();

            var target = new Outer()
            {
                Licenses2 = new Dictionary<string,DriversLicense> {
                    { "first", 
                        new DriversLicense()
                        {
                            Number = "TX"
                        }
                    }
                }
            };

            try
            {
                Validator.ValidateObject(target, Factories.BuildValidationContext(target), true);
                Assert.Fail("Should have thrown an Exception.");
            }
            catch (ValidationException ex)
            {
                var results = (ex.ValidationResult as IEnumerable<ValidationResult>).Flatten(result => result as IEnumerable<ValidationResult>, leafNodesOnly: true);

                Assert.IsTrue((from entry in results
                               from member in entry.MemberNames
                               select member + ": " + entry.ErrorMessage).SequenceEqual(new[] 
                                   { 
                                       "Licenses2[0].Value.Number: Licenses2 Number Invalid", 
                                       "Licenses2[0].Value.State: Licenses2 State Required", 
                                   }));
            }
        }

    }
}
