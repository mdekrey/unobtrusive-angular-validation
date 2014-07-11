using System;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ResponsivePath.Validation.Extensions;
using System.Linq.Expressions;

namespace ResponsivePath.Validation.Tests.Extensions
{
    /// <summary>
    /// Summary description for LinqExpressionExtensionsTest
    /// </summary>
    [TestClass]
    public class LinqExpressionExtensionsTest
    {
        class Target
        {
            public bool ValueField;
            public object ObjectField;

            public Target()
            {
                ValueField = false;
                ObjectField = null;
            }

            public bool ValueProperty { get; set; }
            public object ObjectProperty { get; set; }

            public bool SomeMethod(object param1, bool param2) { throw new NotImplementedException(); }
            public object SomeMethod2(object param1, bool param2) { throw new NotImplementedException(); }
            public void SomeMethod3(object param1, bool param2) { throw new NotImplementedException(); }
        }

        private TestContext testContextInstance;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        #region Additional test attributes
        //
        // You can use the following additional attributes as you write your tests:
        //
        // Use ClassInitialize to run code before running the first test in the class
        // [ClassInitialize()]
        // public static void MyClassInitialize(TestContext testContext) { }
        //
        // Use ClassCleanup to run code after all tests in a class have run
        // [ClassCleanup()]
        // public static void MyClassCleanup() { }
        //
        // Use TestInitialize to run code before running each test 
        // [TestInitialize()]
        // public void MyTestInitialize() { }
        //
        // Use TestCleanup to run code after each test has run
        // [TestCleanup()]
        // public void MyTestCleanup() { }
        //
        #endregion

        [TestMethod]
        public void SimplePropertyTest1()
        {
            Expression<Func<Target, object>> target = t => t.ValueProperty;
            var property = target.SimpleProperty();

            Assert.AreEqual("ValueProperty", property.Name);
        }

        [TestMethod]
        public void SimplePropertyTest2()
        {
            Expression<Func<Target, object>> target = t => t.ObjectProperty;
            var property = target.SimpleProperty();

            Assert.AreEqual("ObjectProperty", property.Name);
        }

        [TestMethod]
        public void SimpleMemberTest1()
        {
            Expression<Func<Target, object>> target = t => t.ValueField;
            var property = target.SimpleMember();

            Assert.AreEqual("ValueField", property.Name);
        }

        [TestMethod]
        public void SimpleMemberTest2()
        {
            Expression<Func<Target, object>> target = t => t.ObjectField;
            var property = target.SimpleMember();

            Assert.AreEqual("ObjectField", property.Name);
        }

        [TestMethod]
        public void SimpleMemberTest3()
        {
            Expression<Func<Target, object>> target = t => t.ValueProperty;
            var property = target.SimpleMember();

            Assert.AreEqual("ValueProperty", property.Name);
        }

        [TestMethod]
        public void SimpleMemberTest4()
        {
            Expression<Func<Target, object>> target = t => t.ObjectProperty;
            var property = target.SimpleMember();

            Assert.AreEqual("ObjectProperty", property.Name);
        }

        [TestMethod]
        public void SimpleMethodCall1()
        {
            Expression<Func<Target, object>> target = t => t.SomeMethod(null, false);
            var property = target.SimpleMethodCall();

            Assert.AreEqual("SomeMethod", property.Name);
        }

        [TestMethod]
        public void SimpleMethodCall2()
        {
            Expression<Func<Target, object>> target = t => t.SomeMethod2(null, false);
            var property = target.SimpleMethodCall();

            Assert.AreEqual("SomeMethod2", property.Name);
        }

        [TestMethod]
        public void SimpleMethodCall3()
        {
            Expression<Action<Target>> target = t => t.SomeMethod3(null, false);
            var property = target.SimpleMethodCall();

            Assert.AreEqual("SomeMethod3", property.Name);
        }

        [TestMethod]
        public void SimpleMethodCall4()
        {
            Expression<Action<Target>> target = t => t.SomeMethod3(null, false);
            var property = target.RemoveLambdaBody().SimpleMethodCall();

            Assert.AreEqual("SomeMethod3", property.Name);
        }
    }
}
