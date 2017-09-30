**Notice**: I am no longer intending to maintain this project. AngularJS was a great framework, and I was quite successful with this library, but I since have moved on to other frameworks. Feel free to use it, fork it, etc.

unobtrusive-angular-validation
==============================

This library is ultimately two portions that can be used independently; an AngularJS implementation of Microsoft's unobtrusive validation library for jQuery, and a small library of C# add-ons for MVC 5's validations.

### Unobtrusive Validation for AngularJS

Version 2 of unobtrusive-angular-validation is built using Angular's existing validation framework through `ngModel`, while extending it for validation message tracking and allowing configuration for timing of messages.

#### Use

To use the validation attributes provided, add `val="true"` to your element with `ng-model` and then add the `val-*` attributes you want. For a complete list and documentation, [see our rule unit tests](ResponsivePath.Validation.Scripts/Assets/TestScripts/Validators).

This also adds a `val-submit` directive that can be placed on an `input type="submit"` or a `button type="submit"` to prevent the form from submitting if the form is invalid.

##### Throttled errors

We've added error throttling to have an `$errors`-like object for various timings.  For example, the `blurErrors` property is populated when you lose focus, and the `submitErrors` property is populated when the form is submitted via the val-submit directive.

There is also an `activeErrors` property that indicates what errors should be active based on your business rules; these can be adjusted at config time by the `validationProvider`.

    validationProvider.setValidationMessagingTiming(ResponsivePath.Validation.Unobtrusive.ValidationTiming.DotNet);

The DotNet timing has a form's active errors update only on submit, but models update on blur, just like you'd expect for the validation summary and direcYou can also configure your own timing rules if you have something other than the defaults.

##### Adding rules
You can also add your own rules!  At config time, use the `validationProvider` and call the `addValidator` method. For examples, see the [internal configuration file](ResponsivePath.Validation.Scripts/Assets/Scripts/zConfiguration.ts).

For example, the regex rule is implemented as follows:

    validationProvider.addValidator('regex', function (val, options) {
        return !val || !!new RegExp(options.parameters.pattern).exec(val);
    });

Note that customized rules should not fail if the value is falsy; the required rule should be used if the value is required.

#### JavaScript Download

If you want to integrate directly with the javascript and aren't using NuGet (or are on a non-C# project), you can download the files from our repository directly:

[Development](js/angular.unobtrusive.validation.js)
([templates](js/angular.unobtrusive.validation.tpls.js))
| 
[Minified](js/angular.unobtrusive.validation.min.js)
([templates](js/angular.unobtrusive.validation.tpls.min.js))

#### Bower Installation
```
bower install angular-validation-unobtrusive
```


### Adding Unobtrusive Client Validation from the Microsoft .NET MVC Framework to AngularJS!

The primary focus of this package is to expose the .NET Framework's data validation syntax to AngularJS without relying on jQuery.

With ASP.Net WebPages or ASP.Net MVC, you can easily create text boxes and other form elements from your models using a syntax such as `@Html.TextBoxFor(m => m.Personal.FirstName)`.  This will render HTML for a fairly simple input box.  This causes the input elements to correspond nicely with the model mapper and, incidentally, the System.ComponentModel.DataAnnotations attributes that allow your classes to be validated in an aspect-oriented way.  In addition, the .Net Framework provides the capability to turn on built-in client-side validation using your web.config, and you'll see that your simple text-box has additional validation logic rendered right along with it.

There's been a huge push for moving away from one-off inline JavaScript, even when it is generated; it allows the users' browsers to be able to cache the scripts, reducing server load and network time for your visitors. As a result, the .Net Framework also provides an "unobtrusive" mode for the validation, which renders additional attributes onto your form elements and then relies on jQuery Validation to perform the actual validation.

With AngularJS, the intention is to completely immerse yourself in the framework; they provide validation hooks with ngModel, flags for $valid on the formController, etc. As a result, we would prefer getting the validation information inside the AngularJS framework rather than relying on jQuery.

In this repository, we've provided our validation.js along with a few tests to verify that it works.

In addition, we are adding a few other utilities for integrating the `HtmlHelper`; we hope you get some use out of them!

#### NuGet Installation

You can install our NuGet packages (C# only) here:

```
PM> Install-Package ResponsivePath.Validation
```

#### Unobtrusive Validation web.config

```xml
    <configuration>
      <appSettings>
        <add key="ClientValidationEnabled" value="true" />
        <add key="UnobtrusiveJavaScriptEnabled" value="true" />    
      </appSettings>
    </configuration>
```
