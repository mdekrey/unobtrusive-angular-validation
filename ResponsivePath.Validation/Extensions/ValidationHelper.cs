using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace ResponsivePath.Validation.Extensions
{
    public class ValidationHelper
    {
        protected readonly HtmlHelper htmlHelper;

        public ValidationHelper(HtmlHelper htmlHelper)
        {
            this.htmlHelper = htmlHelper;
        }

        public IHtmlString ErrorClass(string model)
        {
            return htmlHelper.Raw("data-val-error=\"" + htmlHelper.ViewData.TemplateInfo.GetFullHtmlFieldName(model) + "\"");            
        }
    }
}
