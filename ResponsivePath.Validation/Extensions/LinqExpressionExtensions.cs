using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ResponsivePath.Validation.Extensions
{
    public static class LinqExpressionExtensions
    {
        private static readonly Dictionary<Tuple<Type, string>, object> compiledDelegates = new Dictionary<Tuple<Type, string>, object>();

        public static PropertyInfo SimpleProperty(this Expression expression)
        {
            return expression.SimpleMember() as PropertyInfo;
        }

        public static MemberInfo SimpleMember(this Expression expression)
        {
            var memberExpression = expression.RemoveLambdaBody().RemoveCast() as System.Linq.Expressions.MemberExpression;
            System.Diagnostics.Debug.Assert(memberExpression != null);
            return memberExpression.Member;
        }

        public static MethodInfo SimpleMethodCall(this Expression expression)
        {
            var methodCallExpression = expression.RemoveLambdaBody().RemoveCast() as System.Linq.Expressions.MethodCallExpression;
            System.Diagnostics.Debug.Assert(methodCallExpression != null);
            return methodCallExpression.Method;
        }

        public static Expression RemoveLambdaBody(this Expression expression)
        {
            var lambda = (expression as System.Linq.Expressions.LambdaExpression);
            if (lambda != null)
            {
                return lambda.Body;
            }
            return expression;
        }

        public static Expression RemoveCast(this Expression expression)
        {
            var cast = expression as UnaryExpression;
            if (cast != null && (cast.NodeType == ExpressionType.Convert || cast.NodeType == ExpressionType.ConvertChecked))
            {
                return cast.Operand;
            }
            return expression;
        }

        /// <summary>
        /// Compiles the expression to a delegate, or uses a cached version of an identical expression.
        /// 
        /// Side effect alert: If you access outside variables, this will cache those variables with the first compile; use with caution.
        /// 
        /// Performance alert: If you are constantly creating Expressions dynamically, this could cause a memory explosion and/or lag due to the Compile() process.
        /// </summary>
        /// <typeparam name="TDelegate">The type of delegate to compile</typeparam>
        /// <param name="expression">The expression to compile</param>
        /// <returns>The resulting delegate.</returns>
        public static TDelegate CachedCompile<TDelegate>(this Expression<TDelegate> expression)
        {
            var key = Tuple.Create(typeof(TDelegate), expression.ToString());
            if (!compiledDelegates.ContainsKey(key))
            {
                compiledDelegates[key] = expression.Compile();
            }
            return (TDelegate)compiledDelegates[key];
        }
    }
}
