using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.WebPages;

namespace ResponsivePath.Validation.Extensions
{
    public class ValidationHelper<T> : ValidationHelper
    {
        protected new readonly HtmlHelper<T> htmlHelper;

        public ValidationHelper(HtmlHelper<T> htmlHelper) : base((HtmlHelper)htmlHelper)
        {
            this.htmlHelper = htmlHelper;
        }

        public IHtmlString ErrorClass<TResult>(Expression<Func<T, TResult>> model)
        {
            return ErrorClass(ExpressionHelper.GetExpressionText(model));
        }

    }
}
