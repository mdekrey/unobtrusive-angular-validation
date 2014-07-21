unobtrusive-angular-validation
==============================

###Adding Unobtrusive Client Validation from the Microsoft .NET MVC Framework to AngularJS!

The primary focus of this package is to expose the .NET Framework's data validation syntax to AngularJS without relying on jQuery.

With ASP.Net WebPages or ASP.Net MVC, you can easily create text boxes and other form elements from your models using a syntax such as `@Html.TextBoxFor(m => m.Personal.FirstName)`.  This will render HTML for a fairly simple input box.  This causes the input elements to correspond nicely with the model mapper and, incidentally, the System.ComponentModel.DataAnnotations attributes that allow your classes to be validated in an aspect-oriented way.  In addition, the .Net Framework provides the capability to turn on built-in client-side validation using your web.config, and you'll see that your simple text-box has additional validation logic rendered right along with it.

There's been a huge push for moving away from one-off inline JavaScript, even when it is generated; it allows the users' browsers to be able to cache the scripts, reducing server load and network time for your visitors. As a result, the .Net Framework also provides an "unobtrusive" mode for the validation, which renders additional attributes onto your form elements and then relies on jQuery Validation to perform the actual validation.

With AngularJS, the intention is to completely immerse yourself in the framework; they provide validation hooks with ngModel, flags for $valid on the formController, etc. As a result, we would prefer getting the validation information inside the AngularJS framework rather than relying on jQuery.

In this repository, we've provided our validation.js along with a few tests to verify that it works.

In addition, we are adding a few other utilities for integrating the `HtmlHelper`; we hope you get some use out of them!

####JavaScript Download

If you want to integrate directly with the javascript and aren't using NuGet (or are on a non-C# project), you can download the files from our repository directly:

[Development](https://raw.githubusercontent.com/responsivepath/unobtrusive-angular-validation/master/ResponsivePath.Validation.Web/Scripts/angular.unobtrusive.validation.js) | 
[Minified](https://raw.githubusercontent.com/responsivepath/unobtrusive-angular-validation/master/ResponsivePath.Validation.Web/Scripts/angular.unobtrusive.validation.min.js)

####NuGet Installation

You can install our NuGet packages here:

#####JavaScript
```
PM> Install-Package ResponsivePath.Validation.UnobtrusiveAngular
```

#####C# extension methods
```
PM> Install-Package ResponsivePath.Validation
```

####Unobtrusive Validation web.config

```xml
    <configuration>
      <appSettings>
        <add key="ClientValidationEnabled" value="true" />
        <add key="UnobtrusiveJavaScriptEnabled" value="true" />    
      </appSettings>
    </configuration>
```
