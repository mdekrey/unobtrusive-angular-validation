using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace ResponsivePath.Validation.Extensions
{
    public static class HtmlHelperExtensions
    {
        class ViewDataContainer : IViewDataContainer
        {
            public ViewDataDictionary ViewData { get; set; }
        }

        public static DisposableHtmlHelper<U> ClientRepeater<T, U>(this HtmlHelper<T> htmlHelper, Expression<Func<T, IEnumerable<U>>> modelSelector, string indexString)
        {
            var elementSelector = Expression.Lambda<Func<T, U>>(Expression.ArrayIndex(Expression.Convert(modelSelector.Body, typeof(U[])), Expression.Constant(0)), modelSelector.Parameters.ToArray());

            var viewData = new ViewDataDictionary<U>();
            viewData.ModelMetadata = ModelMetadata.FromLambdaExpression(elementSelector, htmlHelper.ViewData);
            viewData.TemplateInfo = new TemplateInfo() { HtmlFieldPrefix = htmlHelper.ViewData.TemplateInfo.GetFullHtmlFieldName(ExpressionHelper.GetExpressionText(modelSelector) + "[" + indexString + "]") };

            var context = new ViewContext(
                new ControllerContext(htmlHelper.ViewContext.RequestContext, htmlHelper.ViewContext.Controller), 
                htmlHelper.ViewContext.View, 
                viewData, 
                htmlHelper.ViewContext.TempData, 
                htmlHelper.ViewContext.Writer);

            return new DisposableHtmlHelper<U>(context, new ViewDataContainer { ViewData = viewData }, indexString);
        }

        public static ValidationHelper<T> Validation<T>(this HtmlHelper<T> htmlHelper)
        {
            return new ValidationHelper<T>(htmlHelper);
        }

    }
}
