using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ResponsivePath.Validation.Extensions;

namespace ResponsivePath.Validation.Tests
{
    [TestClass]
    public class ValidationServiceTest
    {
        #region Classes for testing

        class Outer
        {
            [Required(ErrorMessage = "Inner Required")]
            [ValidateObject(ErrorMessagePrefix = "Inner ")]
            public Inner Inner { get; set; }

            [ValidateEnumerable(ErrorMessagePrefix = "OptionalList ")]
            public IEnumerable<Inner> OptionalList { get; set; }

            [ValidateEnumerable(ErrorMessagePrefix = "InnerList ")]
            public IEnumerable<Inner> InnerList { get; set; }
        }

        class OuterWithRequiredList
        {
            [Required(ErrorMessage = "Inner Required")]
            [ValidateObject(ErrorMessagePrefix = "Inner ")]
            public Inner Inner { get; set; }

            [Required(ErrorMessage = "InnerList Required")]
            [ValidateEnumerable(ErrorMessagePrefix = "InnerList ")]
            public IEnumerable<Inner> InnerList { get; set; }
        }

        class OuterWithDictionary
        {
            [Required(ErrorMessage = "InnerDictionary Required")]
            [ValidateEnumerable(ErrorMessagePrefix = "InnerDictionary ")]
            public IDictionary<string, Inner> InnerDictionary { get; set; }
        }

        class Inner
        {
            [Required(ErrorMessage = "Value1 Required")]
            public string Value1 { get; set; }

            [Required(ErrorMessage = "Value2 Required")]
            public string Value2 { get; set; }
        }

        #endregion

        private IValidationService CreateService()
        {
            var result = new ValidationService();
            return result;
        }

        private static IEnumerable<string> AsComparable(IEnumerable<ValidationResult> results)
        {
            return results.SelectMany(r => r.MemberNames.Select(m => m + ": " + r.ErrorMessage));
        }

        [TestMethod]
        public void CompleteValidateTest()
        {
            var service = CreateService();
            var results = service.CompleteValidate(new Outer());

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "Inner: Inner Required" }));

            results = service.CompleteValidate(new Outer()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() }
            });

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "Inner.Value1: Inner Value1 Required", "Inner.Value2: Inner Value2 Required", "InnerList[0].Value1: InnerList Value1 Required", "InnerList[0].Value2: InnerList Value2 Required" }));

            results = service.CompleteValidate(new Outer()
            {
                Inner = new Inner() { Value1 = "a", Value2 = "b" },
                InnerList = new[] { new Inner() { Value1 = "c", Value2 = "d" } }
            });

            Assert.IsFalse(AsComparable(results).Any());
        }

        [TestMethod]
        public void PartialValidateRootOnlyTest()
        {
            var service = CreateService();
            var results = service.PartialValidate(new Outer());

            Assert.IsFalse(AsComparable(results).Any());

            results = service.PartialValidate(new Outer()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() }
            }, t => t.Inner, t => t.InnerList);

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "Inner.Value1: Inner Value1 Required", "Inner.Value2: Inner Value2 Required", "InnerList[0].Value1: InnerList Value1 Required", "InnerList[0].Value2: InnerList Value2 Required" }));

            results = service.PartialValidate(new Outer()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() }
            }, t => t.Inner);

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "Inner.Value1: Inner Value1 Required", "Inner.Value2: Inner Value2 Required" }));

            results = service.PartialValidate(new Outer()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() }
            }, t => t.InnerList);

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "InnerList[0].Value1: InnerList Value1 Required", "InnerList[0].Value2: InnerList Value2 Required" }));

            results = service.PartialValidate(new Outer()
            {
                Inner = new Inner()
            }, t => t.InnerList);

            Assert.IsFalse(AsComparable(results).Any());
        }

        [TestMethod]
        public void PartialValidateInnerTest()
        {
            var service = CreateService();
            var results = service.PartialValidate(new Outer());

            Assert.IsFalse(AsComparable(results).Any());

            results = service.PartialValidate(new Outer()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() }
            }, t => t.Inner.Value1);

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "Inner.Value1: Inner Value1 Required" }));

            results = service.PartialValidate(new Outer()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() }
            }, t => t.Inner.Value2);

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "Inner.Value2: Inner Value2 Required" }));

            results = service.PartialValidate(new Outer()
            {
                Inner = null,
                InnerList = new[] { new Inner() }
            }, t => t.Inner.Value2);

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "Inner.Value2: Inner Value2 Required" }));

        }

        [TestMethod]
        public void PartialValidateOptionalTest()
        {
            var service = CreateService();
            var results = service.PartialValidate(new Outer());

            Assert.IsFalse(AsComparable(results).Any());

            results = service.PartialValidate(new Outer()
            {
                OptionalList = new[] { new Inner() },
                InnerList = new[] { new Inner() }
            }, t => t.OptionalList.PartialValidate(p => p.Value1));

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "OptionalList[0].Value1: OptionalList Value1 Required" }));

            results = service.PartialValidate(new Outer()
            {
                OptionalList = new[] { new Inner() },
                InnerList = new[] { new Inner() }
            }, t => t.OptionalList.PartialValidate(p => p.Value2));

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "OptionalList[0].Value2: OptionalList Value2 Required" }));

            results = service.PartialValidate(new Outer()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() }
            }, t => t.OptionalList.PartialValidate(p => p.Value2));

            Assert.IsFalse(AsComparable(results).Any());
        }

        [TestMethod]
        public void PartialValidateNotPartialTest()
        {
            var service = CreateService();
            var results = service.PartialValidate(new Outer());

            Assert.IsFalse(AsComparable(results).Any());

            results = service.PartialValidate(new Outer()
            {
                OptionalList = new[] { new Inner() },
                InnerList = new[] { new Inner() }
            }, t => t);

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { 
                "Inner: Inner Required",
                "OptionalList[0].Value1: OptionalList Value1 Required",
                "OptionalList[0].Value2: OptionalList Value2 Required",
                "InnerList[0].Value1: InnerList Value1 Required",
                "InnerList[0].Value2: InnerList Value2 Required"
            }));
        }

        [TestMethod]
        public void PartialValidateConstantTest()
        {
            var service = CreateService();
            var results = service.PartialValidate(new Outer());

            Assert.IsFalse(AsComparable(results).Any());

            try
            {
                results = service.PartialValidate(new Outer()
                {
                    OptionalList = new[] { new Inner() },
                    InnerList = new[] { new Inner() }
                }, t => 5);
                Assert.Fail();
            }
            catch (NotSupportedException)
            {

            }
        }

        [TestMethod]
        public void PartialValidateInnerListTest()
        {
            var service = CreateService();
            var results = service.PartialValidate(new Outer());

            Assert.IsFalse(AsComparable(results).Any());

            results = service.PartialValidate(new OuterWithRequiredList()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() }
            }, t => t.InnerList.PartialValidate(inner => inner.Value1));

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "InnerList[0].Value1: InnerList Value1 Required" }));

            results = service.PartialValidate(new OuterWithRequiredList()
            {
                Inner = new Inner(),
                InnerList = new[] { new Inner() { Value1 = "a" } }
            }, t => t.InnerList.PartialValidate(inner => inner.Value1));

            Assert.IsFalse(AsComparable(results).Any());

            results = service.PartialValidate(new OuterWithRequiredList()
            {
                Inner = new Inner()
            }, t => t.InnerList.PartialValidate(inner => inner.Value1));

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "InnerList: InnerList Required" }));

        }

        [TestMethod]
        public void PartialValidateDictionaryTest()
        {
            var service = CreateService();
            var results = service.PartialValidate(new Outer());

            Assert.IsFalse(AsComparable(results).Any());

            results = service.PartialValidate(new OuterWithDictionary()
            {
                InnerDictionary = new Dictionary<string, Inner> { { "first", new Inner() }}
            }, t => t.InnerDictionary.PartialValidate(inner => inner.Value.Value1));

            Assert.IsTrue(AsComparable(results).SequenceEqual(new[] { "InnerDictionary[0].Value.Value1: InnerDictionary Value1 Required" }));
        }
    }
}
