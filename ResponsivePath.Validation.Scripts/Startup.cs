using System;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Http;
using Microsoft.AspNet.StaticFiles;
using Microsoft.Framework.DependencyInjection;

namespace ResponsivePath.Validation.Scripts
{
    public class Startup
    {
        // For more information on how to configure your application, visit http://go.microsoft.com/fwlink/?LinkID=398940
        public void ConfigureServices(IServiceCollection services)
        {
        }

        public void Configure(IApplicationBuilder app)
        {
			var webRoot = System.IO.Path.Combine(app.ApplicationServices.GetRequiredService<IHostingEnvironment>().WebRoot, "..");

			app.UseStaticFiles();
			app.UseStaticFiles(new StaticFileOptions
			{
				FileProvider = new Microsoft.AspNet.FileProviders.PhysicalFileProvider(webRoot)
            });
		}
	}
}
