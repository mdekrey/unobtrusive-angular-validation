using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using ResponsivePath.Validation.Extensions;

namespace ResponsivePath.Validation.Tests.Extensions
{
    [TestClass]
    public class ValidationHelperTest
    {
        class Target
        {
            [Required]
            public Item IndividualItem { get; set; }
            public IEnumerable<Item> List { get; set; }
            public Item[] Array { get; set; }
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

        [TestMethod]
        public void ErrorClassTest()
        {
            var target = HtmlHelperFactory.CreateHtmlHelper<Target>(new ViewDataDictionary<Target>());
            var result = target.ClientRepeater(t => t.Array, "{{index}}");

            Assert.AreEqual("data-val-error=\"Array[{{index}}].Name\"", result.Fix(r => r.Validation().ErrorClass(t => t.Name)).ToString());
        }
    }
}
