using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace ResponsivePath.Validation.Tests
{
    [TestClass]
    public class FactoriesTest
    {
        private Func<object, System.ComponentModel.DataAnnotations.ValidationContext> initialBuildValidationContext;
        private Func<IValidationService> initialBuildValidationService;

        [TestInitialize()]
        public void MyTestInitialize()
        {
            initialBuildValidationContext = Factories.BuildValidationContext;
            initialBuildValidationService = Factories.BuildValidationService;
        }

        [TestCleanup()]
        public void MyTestCleanup()
        {
            Factories.BuildValidationContext = initialBuildValidationContext;
            Factories.BuildValidationService = initialBuildValidationService;
        }

        [TestMethod]
        public void SetBuildValidationServiceToNullTest()
        {
            try
            {
                Factories.BuildValidationService = null;
                Assert.Fail();
            }
            catch (ArgumentNullException)
            {
            }
        }

        [TestMethod]
        public void SetBuildValidationContextToNullTest()
        {
            try
            {
                Factories.BuildValidationContext = null;
                Assert.Fail();
            }
            catch (ArgumentNullException)
            {
            }
        }

        [TestMethod]
        public void SetBuildValidationServiceSomethingElseTest()
        {
            Moq.Mock<IValidationService> mockService = new Moq.Mock<IValidationService>();

            Factories.BuildValidationService = () => mockService.Object;
            var actual = Factories.BuildValidationService();
            Assert.AreEqual(mockService.Object, actual);
        }

        [TestMethod]
        public void SetBuildValidationContextSomethingElseTest()
        {
            var expected = new System.ComponentModel.DataAnnotations.ValidationContext(new object());
            var target = new object();

            Factories.BuildValidationContext = (obj) =>
            {
                Assert.AreEqual(target, obj);
                return expected;
            };
            var actual = Factories.BuildValidationContext(target);
            Assert.AreEqual(expected, actual);
        }


        [TestMethod]
        public void UseDefaultBuildValidationServiceTest()
        {
            var actual = Factories.BuildValidationService();
            Assert.IsNotNull(actual);
        }

        [TestMethod]
        public void UseDefaultBuildValidationContextTest()
        {
            var target = new object();
            var actual = Factories.BuildValidationContext(target);
            Assert.IsNotNull(actual);
            Assert.AreEqual(target, actual.ObjectInstance);
        }
    }
}
