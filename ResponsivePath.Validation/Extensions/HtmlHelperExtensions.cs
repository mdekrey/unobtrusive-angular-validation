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

        public static DisposableHtmlHelper<U> Shortcut<T, U>(this HtmlHelper<T> htmlHelper, Expression<Func<T, U>> modelSelector)
        {
            return htmlHelper.Shortcut(modelSelector, Enumerable.Empty<string>());
        }

        internal static DisposableHtmlHelper<U> Shortcut<T, U>(this HtmlHelper<T> htmlHelper, Expression<Func<T, U>> modelSelector, IEnumerable<string> additionalIndexStrings)
        {
            var prefix = htmlHelper.ViewData.TemplateInfo.GetFullHtmlFieldName(GetExpressionTextIncludingConverts(modelSelector));

            return CreateChildHtmlHandler<T, U>(htmlHelper, modelSelector, additionalIndexStrings, prefix);
        }

        public static DisposableHtmlHelper<U> ClientRepeater<T, U>(this HtmlHelper<T> htmlHelper, Expression<Func<T, IEnumerable<U>>> modelSelector, string indexString)
        {
            return htmlHelper.ClientRepeater(modelSelector, indexString, Enumerable.Empty<string>());
        }

        internal static DisposableHtmlHelper<U> ClientRepeater<T, U>(this HtmlHelper<T> htmlHelper, Expression<Func<T, IEnumerable<U>>> modelSelector, string indexString, IEnumerable<string> additionalIndexStrings)
        {
            var elementSelector = Expression.Lambda<Func<T, U>>(Expression.ArrayIndex(Expression.Convert(Expression.Convert(modelSelector.Body, typeof(IEnumerable<U>)), typeof(U[])), Expression.Constant(0)), modelSelector.Parameters.ToArray());
            var prefix = htmlHelper.ViewData.TemplateInfo.GetFullHtmlFieldName(GetExpressionTextIncludingConverts(modelSelector) + "[" + indexString + "]");

            return CreateChildHtmlHandler<T, U>(htmlHelper, elementSelector, additionalIndexStrings.Concat(Enumerable.Repeat(indexString, 1)), prefix);
        }

        public static ValidationHelper<T> Validation<T>(this HtmlHelper<T> htmlHelper)
        {
            return new ValidationHelper<T>(htmlHelper);
        }

        private static DisposableHtmlHelper<U> CreateChildHtmlHandler<T, U>(HtmlHelper<T> htmlHelper, Expression<Func<T, U>> modelSelector, IEnumerable<string> additionalIndexStrings, string prefix)
        {
            var viewData = new ViewDataDictionary<U>();
            try
            {
                viewData.ModelMetadata = ModelMetadata.FromLambdaExpression(modelSelector, htmlHelper.ViewData);
            }
            catch
            {
                // we want to actually allow doing a few more odd things in here, such as casting
            }
            viewData.TemplateInfo = new TemplateInfo() { HtmlFieldPrefix = prefix };

            var context = new ViewContext(
                new ControllerContext(htmlHelper.ViewContext.RequestContext, htmlHelper.ViewContext.Controller),
                htmlHelper.ViewContext.View,
                viewData,
                htmlHelper.ViewContext.TempData,
                htmlHelper.ViewContext.Writer);

            return new DisposableHtmlHelper<U>(context, new ViewDataContainer { ViewData = viewData }, additionalIndexStrings);
        }

        private static string GetExpressionTextIncludingConverts(LambdaExpression expression)
        {
            // The ExpressionHelper currently stops at Convert expressions, so we split the expression at those points.
            Expression currentExpression = expression.Body;
            while (currentExpression != null)
            {
                if (currentExpression.NodeType == ExpressionType.Call)
                {
                    MethodCallExpression methodCallExpression = (MethodCallExpression)currentExpression;
                    currentExpression = methodCallExpression.Object;
                }
                else if (currentExpression.NodeType == ExpressionType.ArrayIndex)
                {
                    BinaryExpression binaryExpression = (BinaryExpression)currentExpression;
                    currentExpression = binaryExpression.Left;
                }
                else if (currentExpression.NodeType == ExpressionType.MemberAccess)
                {
                    MemberExpression memberExpression = (MemberExpression)currentExpression;
                    currentExpression = memberExpression.Expression;
                }
                else if (currentExpression.NodeType == ExpressionType.Convert)
                {
                    // This is where it gets interesting
                    UnaryExpression convertExpression = (UnaryExpression)currentExpression;
                    var firstPart = GetExpressionTextIncludingConverts(Expression.Lambda(convertExpression.Operand, expression.Parameters));
                    var secondPart = ExpressionHelper.GetExpressionText(expression);
                    if (!string.IsNullOrEmpty(firstPart) && !string.IsNullOrEmpty(secondPart))
                    {
                        return firstPart + "." + secondPart;
                    }
                    else
                    {
                        return firstPart + secondPart;
                    }
                }
                else
                {
                    break;
                }
            }

            return ExpressionHelper.GetExpressionText(expression);
        }

    }
}
