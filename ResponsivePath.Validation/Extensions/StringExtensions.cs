using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ResponsivePath.Validation.Extensions
{
    static class StringExtensions
    {
        /// <summary>
        /// Prepends a prefix if the target is not null or empty
        /// </summary>
        /// <param name="target">The target string in question</param>
        /// <param name="prefix">The prefix</param>
        /// <returns>The prefix and target, or the original target if it was null or empty</returns>
        public static string Prefix(this string target, string prefix)
        {
            if (!string.IsNullOrEmpty(target))
                return prefix + target;
            return target;
        }

    }
}
