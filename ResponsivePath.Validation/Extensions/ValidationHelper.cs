using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ResponsivePath.Validation.Extensions
{
    public class ValidationHelper
    {
        private readonly HtmlHelper htmlHelper;

        public ValidationHelper(HtmlHelper htmlHelper)
        {
            this.htmlHelper = htmlHelper;
        }
    }
}
