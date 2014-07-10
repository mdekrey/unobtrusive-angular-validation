using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web.Mvc;

namespace ResponsivePath.Validation.Extensions
{
    public class DisposableHtmlHelper<TModel> : HtmlHelper<TModel>, IDisposable
    {
        private readonly string indexer;

        public DisposableHtmlHelper(ViewContext viewContext, IViewDataContainer viewDataContainer, string indexer)
            : base(viewContext, viewDataContainer)
        {
            this.indexer = indexer;
        }

        public MvcHtmlString Fix(Func<DisposableHtmlHelper<TModel>, MvcHtmlString> funcToFixId)
        {
            var original = funcToFixId(this);

            var idPart = HtmlHelper.GenerateIdFromName('a' + indexer).Substring(1);
            var regex1 = "^([^\"]*)(" + idPart + ")([^\"]*)$";
            var regex2 = "(id=\"[^\"]*)(" + idPart + ")([^\"]*\")";

            var result = new MvcHtmlString(Regex.Replace(Regex.Replace(original.ToString(), regex1, "$1" + indexer + "$3"), regex2, "$1" + indexer + "$3"));

            return result;
        }

        void IDisposable.Dispose()
        {
        }
    }
}
