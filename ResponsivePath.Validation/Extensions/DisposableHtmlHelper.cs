using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.Mvc;

namespace ResponsivePath.Validation.Extensions
{
    public class DisposableHtmlHelper<TModel> : HtmlHelper<TModel>, IDisposable
    {
        private readonly IEnumerable<string> indexers;

        public DisposableHtmlHelper(ViewContext viewContext, IViewDataContainer viewDataContainer, IEnumerable<string> indexers)
            : base(viewContext, viewDataContainer)
        {
            this.indexers = indexers;
        }

        public IHtmlString Fix(Func<DisposableHtmlHelper<TModel>, IHtmlString> funcToFixId)
        {
            var original = funcToFixId(this);

            foreach (var indexer in indexers)
            {
                var idPart = HtmlHelper.GenerateIdFromName('a' + indexer).Substring(1);
                var regex1 = "^([^\"]*)(" + idPart + ")([^\"]*)$";
                var regex2 = "((?:id|for)=\"[^\"]*)(" + idPart + ")([^\"]*\")";

                original = new HtmlString(Regex.Replace(Regex.Replace(original.ToString(), regex1, "$1" + indexer + "$3"), regex2, "$1" + indexer + "$3"));
            }

            return original;
        }

        public DisposableHtmlHelper<T> Shortcut<T>(Expression<Func<TModel, T>> modelSelector)
        {
            return this.Shortcut(modelSelector, indexers);
        }

        public DisposableHtmlHelper<T> ClientRepeater<T>(Expression<Func<TModel, IEnumerable<T>>> modelSelector, string indexString)
        {
            return this.ClientRepeater(modelSelector, indexString, indexers);
        }

        void IDisposable.Dispose()
        {
        }
    }
}
