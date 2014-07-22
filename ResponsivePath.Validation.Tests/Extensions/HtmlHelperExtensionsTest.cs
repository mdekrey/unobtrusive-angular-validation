using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;
using System.Web.Routing;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using ResponsivePath.Validation.Extensions;

namespace ResponsivePath.Validation.Tests.Extensions
{
    /// <summary>
    /// Summary description for LinqExpressionExtensionsTest
    /// </summary>
    [TestClass]
    public class HtmlHelperExtensionsTest
    {
        class Target
        {
            [Required]
            public Item IndividualItem { get; set; }
            public IEnumerable<Item> List { get; set; }
            public Item[] Array { get; set; }
            public Dictionary<string, Item> Dictionary { get; set; }
        }

        class Item
        {
            [Required]
            [MinLength(4)]
            public string Name { get; set; }
            [Range(1, 3.5)]
            public int Number { get; set; }
            public Guid[] InnerSet { get; set; }
        }

        class SpecializedItem : Item
        {
            [Required]
            [MinLength(4)]
            public string Description { get; set; }
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
        public void ShortcutTest1()
        {
            var target = HtmlHelperFactory.CreateHtmlHelper<Target>(new ViewDataDictionary<Target>());
            var result = target.Shortcut(t => t.IndividualItem);

            Assert.IsTrue(result is HtmlHelper<Item>);
            Assert.AreEqual(target.ViewContext.HttpContext, result.ViewContext.HttpContext);
            Assert.AreEqual(target.ViewContext.RouteData, result.ViewContext.RouteData);
            Assert.AreEqual(target.TextBoxFor(t => t.IndividualItem.Name).ToString(), result.TextBoxFor(t => t.Name).ToString());
        }

        [TestMethod]
        public void ShortcutTest2()
        {
            var target = HtmlHelperFactory.CreateHtmlHelper<Target>(new ViewDataDictionary<Target>());
            var result = target.Shortcut(t => t.IndividualItem).Shortcut(t => t.Name);

            Assert.IsTrue(result is HtmlHelper<string>);
            Assert.AreEqual(target.ViewContext.HttpContext, result.ViewContext.HttpContext);
            Assert.AreEqual(target.ViewContext.RouteData, result.ViewContext.RouteData);
            Assert.AreEqual(target.TextBoxFor(t => t.IndividualItem.Name).ToString(), result.TextBoxFor(t => t).ToString());
        }

        [TestMethod]
        public void ShortcutTest3()
        {
            var target = HtmlHelperFactory.CreateHtmlHelper<Target>(new ViewDataDictionary<Target>());
            var result = target.Shortcut(t => t.IndividualItem).Shortcut(t => (SpecializedItem)t);

            Assert.AreEqual(target.ViewContext.HttpContext, result.ViewContext.HttpContext);
            Assert.AreEqual(target.ViewContext.RouteData, result.ViewContext.RouteData);
            Assert.AreEqual("IndividualItem_Description", result.IdFor(t => t.Description).ToString());
        }

        [TestMethod]
        public void ShortcutTest4()
        {
            var target = HtmlHelperFactory.CreateHtmlHelper<Target>(new ViewDataDictionary<Target>());
            var result = target.Shortcut(t => t.IndividualItem).Shortcut(t => (SpecializedItem)t);

            Assert.AreEqual(target.ViewContext.HttpContext, result.ViewContext.HttpContext);
            Assert.AreEqual(target.ViewContext.RouteData, result.ViewContext.RouteData);
            Assert.AreEqual(target.TextBoxFor(t => t.IndividualItem.Name).ToString(), result.TextBoxFor(t => t.Name).ToString());
            Assert.AreEqual(target.TextBoxFor(t => t.IndividualItem.Name).ToString().Replace("Name", "Description"), result.TextBoxFor(t => t.Description).ToString());
        }

        [TestMethod]
        public void ShortcutTest5()
        {
            var target = HtmlHelperFactory.CreateHtmlHelper<Target>(new ViewDataDictionary<Target>());
            var result = target.Shortcut(t => (SpecializedItem)t.IndividualItem);

            Assert.AreEqual(target.ViewContext.HttpContext, result.ViewContext.HttpContext);
            Assert.AreEqual(target.ViewContext.RouteData, result.ViewContext.RouteData);
            Assert.AreEqual(target.TextBoxFor(t => t.IndividualItem.Name).ToString(), result.TextBoxFor(t => t.Name).ToString());
            Assert.AreEqual(target.TextBoxFor(t => t.IndividualItem.Name).ToString().Replace("Name", "Description"), result.TextBoxFor(t => t.Description).ToString());
        }

        [TestMethod]
        public void ShortcutTest6()
        {
            var target = HtmlHelperFactory.CreateHtmlHelper<Target>(new ViewDataDictionary<Target>());
            var result = target.Shortcut(t => ((SpecializedItem)t.IndividualItem).Name);

            Assert.AreEqual(target.ViewContext.HttpContext, result.ViewContext.HttpContext);
            Assert.AreEqual(target.ViewContext.RouteData, result.ViewContext.RouteData);
            Assert.AreEqual(target.TextBoxFor(t => t.IndividualItem.Name).ToString(), result.TextBoxFor(t => t).ToString());
            Assert.AreEqual(target.TextBoxFor(t => t.IndividualItem.Name).ToString().Replace("Name", "Description"), result.TextBoxFor(t => t).ToString());
        }

        [TestMethod]
        public void ShortcutTest7()
        {
            var target = HtmlHelperFactory.CreateHtmlHelper<Target>(new ViewDataDictionary<Target>());
            var result = target.Shortcut(t => (SpecializedItem)t.IndividualItem).Shortcut(t => t.Name);

            Assert.AreEqual(target.ViewContext.HttpContext, result.ViewContext.HttpContext);
            Assert.AreEqual(target.ViewContext.RouteData, result.ViewContext.RouteData);
            Assert.AreEqual(target.TextBoxFor(t => t.IndividualItem.Name).ToString(), result.TextBoxFor(t => t).ToString());
            Assert.AreEqual(target.TextBoxFor(t => t.IndividualItem.Name).ToString().Replace("Name", "Description"), result.TextBoxFor(t => t).ToString());
        }

        [TestMethod]
        public void DisposeTest()
        {
            var target = HtmlHelperFactory.CreateHtmlHelper<Target>(new ViewDataDictionary<Target>());
            using (var result = target.Shortcut(t => t.IndividualItem))
            {

            }
        }

        [TestMethod]
        public void ClientRepeaterTest1()
        {
            var target = HtmlHelperFactory.CreateHtmlHelper<Target>(new ViewDataDictionary<Target>());
            var result = target.ClientRepeater(t => t.Array, "{{index}}");

            Assert.IsTrue(result is HtmlHelper<Item>);
            Assert.AreEqual(target.ViewContext.HttpContext, result.ViewContext.HttpContext);
            Assert.AreEqual(target.ViewContext.RouteData, result.ViewContext.RouteData);
            Assert.AreEqual("<input id=\"Array_{{index}}__Name\" name=\"Array[{{index}}].Name\" type=\"text\" value=\"\" />", result.Fix(r => r.TextBoxFor(t => t.Name)).ToString());
        }

        [TestMethod]
        public void ClientRepeaterTest2()
        {
            var target = HtmlHelperFactory.CreateHtmlHelper<Target>(new ViewDataDictionary<Target>());
            var result = target.ClientRepeater(t => t.List, "{{index}}");

            Assert.IsTrue(result is HtmlHelper<Item>);
            Assert.AreEqual(target.ViewContext.HttpContext, result.ViewContext.HttpContext);
            Assert.AreEqual(target.ViewContext.RouteData, result.ViewContext.RouteData);
            Assert.AreEqual("<input id=\"List_{{index}}__Name\" name=\"List[{{index}}].Name\" type=\"text\" value=\"\" />", result.Fix(r => r.TextBoxFor(t => t.Name)).ToString());
        }

        [TestMethod]
        public void ClientRepeaterTest3()
        {
            var target = HtmlHelperFactory.CreateHtmlHelper<Target>(new ViewDataDictionary<Target>());
            var result = target.ClientRepeater(t => t.List, "{{index}}").ClientRepeater(t => t.InnerSet, "{{index2}}");

            Assert.IsTrue(result is HtmlHelper<Guid>);
            Assert.AreEqual(target.ViewContext.HttpContext, result.ViewContext.HttpContext);
            Assert.AreEqual(target.ViewContext.RouteData, result.ViewContext.RouteData);
            Assert.AreEqual("<input id=\"List_{{index}}__InnerSet_{{index2}}_\" name=\"List[{{index}}].InnerSet[{{index2}}]\" type=\"text\" value=\"\" />", result.Fix(r => r.TextBoxFor(t => t)).ToString());
        }

        [TestMethod]
        public void ClientRepeaterTest4()
        {
            var target = HtmlHelperFactory.CreateHtmlHelper<Target>(new ViewDataDictionary<Target>());
            var result = target.ClientRepeater(t => t.Dictionary, "{{index}}");

            Assert.IsTrue(result is HtmlHelper<KeyValuePair<string, Item>>);
            Assert.AreEqual(target.ViewContext.HttpContext, result.ViewContext.HttpContext);
            Assert.AreEqual(target.ViewContext.RouteData, result.ViewContext.RouteData);
            Assert.AreEqual("<input id=\"Dictionary_{{index}}__Value\" name=\"Dictionary[{{index}}].Value\" type=\"text\" value=\"\" />", result.Fix(r => r.TextBoxFor(t => t.Value)).ToString());
        }
    }
}
