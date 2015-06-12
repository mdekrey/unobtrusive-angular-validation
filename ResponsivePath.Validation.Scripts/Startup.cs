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
        public void Configure(IApplicationBuilder app)
        {
			var webRoot = System.IO.Path.Combine(app.ApplicationServices.GetRequiredService<IHostingEnvironment>().WebRootPath, "..");

			app.UseStaticFiles();
			app.UseStaticFiles(new StaticFileOptions
			{
				FileProvider = new Microsoft.AspNet.FileProviders.PhysicalFileProvider(webRoot)
            });
		}
	}
}
