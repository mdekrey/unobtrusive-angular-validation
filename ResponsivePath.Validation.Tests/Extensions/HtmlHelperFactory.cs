using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using Moq;

namespace ResponsivePath.Validation.Tests.Extensions
{
    static class HtmlHelperFactory
    {
        // Thank you to Thomas Ardal for providing the following method.
        // http://thomasardal.com/unit-testing-htmlhelper-extension-methods/
        public static HtmlHelper<T> CreateHtmlHelper<T>(ViewDataDictionary viewData)
        {
            var cc = new Mock<ControllerContext>(
                new Mock<HttpContextBase>() { DefaultValue = DefaultValue.Mock }.Object,
                new RouteData(),
                new Mock<ControllerBase>().Object) { DefaultValue = DefaultValue.Mock, CallBase = true };

            var mockViewContext = new Mock<ViewContext>(
                cc.Object,
                new Mock<IView>().Object,
                viewData,
                new TempDataDictionary(),
                TextWriter.Null) { CallBase = true };

            var mockViewDataContainer = new Mock<IViewDataContainer>();

            mockViewDataContainer.Setup(v => v.ViewData).Returns(viewData);

            return new HtmlHelper<T>(
                mockViewContext.Object, mockViewDataContainer.Object);
        }

    }
}
