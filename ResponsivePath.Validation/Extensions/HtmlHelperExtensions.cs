using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ResponsivePath.Validation.Extensions
{
    public static class HtmlHelperExtensions
    {
        public static ValidationHelper<T> Validation<T>(this HtmlHelper<T> htmlHelper)
        {
            return new ValidationHelper<T>(htmlHelper);
        }

    }
}
