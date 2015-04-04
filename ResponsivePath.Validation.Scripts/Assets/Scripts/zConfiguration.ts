module ResponsivePath.Validation.Unobtrusive {

    function getModelPrefix(fieldName: string): string {
        return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
    }

    function appendModelPrefix(value: string, prefix: string): string {
        if (value.indexOf("*.") === 0) {
            value = value.replace("*.", prefix);
        }
        return value;
    }

    interface OptionsP<TParameters extends ValidationParameters> extends Validator {
        parameters: TParameters;
    }
    interface OptionsA<TAttributes extends ng.IAttributes> extends Validator {
        attributes: TAttributes;
    }
    interface OptionsI<TInjected extends InjectedValidationValues> extends Validator {
        injected: TInjected;
    }
    interface OptionsAIP<TAttributes extends ng.IAttributes, TInjected extends InjectedValidationValues, TParameters extends ValidationParameters> extends Validator {
        parameters: TParameters;
        attributes: TAttributes;
        injected: TInjected;
    }

    interface RegexParameters extends ValidationParameters {
        pattern: string
    }
    interface MinParameters extends ValidationParameters {
        min: string
    }
    interface MaxParameters extends ValidationParameters {
        max: string
    }
    interface MinMaxParameters extends MinParameters, MaxParameters {
    }
    interface PasswordParameters extends MinParameters {
        nonalphamin: string;
        regex: string;
    }
    interface NamedAttributes extends ng.IAttributes {
        // stores the DotNetName
        name: string
    }
    interface EqualToParameters extends ValidationParameters {
        other: string;
    }
    interface EqualToInjected extends InjectedValidationValues {
        validation: ValidationService;
    }
    interface ExtensionParameters extends ValidationParameters {
        extension: string;
    }

    interface RemoteModelController extends IValidatedModelController {
        remoteTimeout: ng.IDeferred<{}>;
    }
    interface RemoteParameters extends ValidationParameters {
        additionalfields: string;
        type: string;
        url: string;
    }
    interface RemoteInjected extends InjectedValidationValues {
        validation: ValidationService;
        $q: ng.IQService;
        $http: ng.IHttpService;
    }
    interface RemoteValidator extends Validator {
        ngModel: RemoteModelController;
        attributes: NamedAttributes;
        injected: RemoteInjected;
        parameters: RemoteParameters;
    }

    function configureValidationProvider(validationProvider: ValidationProvider): void {
        validationProvider.addValidator('required', (val: string) => { return !!val; });
        validationProvider.addValidator('regex',(val: string, options: OptionsP<RegexParameters>) => {
            return !val || !!new RegExp(options.parameters.pattern).exec(val);
        });
        validationProvider.addValidator('email', (val: string) => {
            // regex taken from jquery.validate v1.12.0
            // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
            // Retrieved 2014-01-14
            // If you have a problem with this implementation, report a bug against the above spec
            // Or use custom methods to implement your own email validation
            return !val || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(val);
        });
        validationProvider.addValidator("creditcard", (value: string) => {
            if (!value)
                return true;
            // regex taken from jquery.validate v1.12.0
            // accept only spaces, digits and dashes
            if (/[^0-9 \-]+/.test(value)) {
                return false;
            }
            var nCheck = 0,
                nDigit = 0,
                bEven = false,
                n: number,
                cDigit: string;

            value = value.replace(/\D/g, "");

            // Basing min and max length on
            // http://developer.ean.com/general_info/Valid_Credit_Card_Types
            if (value.length < 13 || value.length > 19) {
                return false;
            }

            for (n = value.length - 1; n >= 0; n--) {
                cDigit = value.charAt(n);
                nDigit = parseInt(cDigit, 10);
                if (bEven) {
                    if ((nDigit *= 2) > 9) {
                        nDigit -= 9;
                    }
                }
                nCheck += nDigit;
                bEven = !bEven;
            }

            return (nCheck % 10) === 0;
        });
        validationProvider.addValidator("date", (val: string) => {
            if (!val)
                return true;
            return !/Invalid|NaN/.test(new Date(val).toString());
        });
        validationProvider.addValidator("digits", (val: string) => {
            if (!val)
                return true;
            return /^\d+$/.test(val);
        });
        validationProvider.addValidator("number", (val: string) => {
            if (!val)
                return true;
            return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(val);
        });
        validationProvider.addValidator("url", (val: string) => {
            if (!val)
                return true;
            // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
            return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(val);
        });
        validationProvider.addValidator("minlength",(val: string, options: OptionsP<MinParameters>) => {
            if (!val)
                return true;
            return val.length >= parseInt(options.parameters.min);
        });
        validationProvider.addValidator("maxlength",(val: string, options: OptionsP<MaxParameters>) => {
            if (!val)
                return true;
            return val.length <= parseInt(options.parameters.max);
        });
        validationProvider.addValidator("length",(val: string, options: OptionsP<MinMaxParameters>) => {
            if (!val)
                return true;
            return (!options.parameters.min || val.length >= parseInt(options.parameters.min))
                && (!options.parameters.max || val.length <= parseInt(options.parameters.max));
        });
        validationProvider.addValidator("range",(val: string, options: OptionsP<MinMaxParameters>) => {
            if (!val)
                return true;

            var value = parseFloat(val);
            return value <= parseFloat(options.parameters.max) && value >= parseFloat(options.parameters.min);
        });
        validationProvider.addValidator("password",(val: string, options: OptionsP<PasswordParameters>) => {
            function nonalphamin(value: string, min: number): boolean {
                var match = value.match(/\W/g);
                return match && match.length >= min;
            }
            if (!val)
                return true;
            return (!options.parameters.min || val.length >= parseInt(options.parameters.min))
                && (!options.parameters.nonalphamin || nonalphamin(val, parseInt(options.parameters.nonalphamin)))
                && (!options.parameters.regex || !!(new RegExp(options.parameters.regex).exec(val)));
        });
        validationProvider.addValidator("equalto",(val: string, options: OptionsAIP<NamedAttributes, EqualToInjected, EqualToParameters>) => {
            if (!val)
                return true;
            var prefix = getModelPrefix(options.attributes.name),
                other = options.parameters.other,
                fullOtherName = appendModelPrefix(other, prefix),
                element = options.injected.validation.dataValue(options.scope, fullOtherName);
			
            return element == val;
        }, ['validation']);
        validationProvider.addValidator("extension",(val: string, options: OptionsP<ExtensionParameters>) => {
            if (!val)
                return true;
            var param = typeof options.parameters.extension == "string" ? options.parameters.extension.replace(/,/g, '|') : "png|jpe?g|gif";
            return !!new RegExp("\\.(" + param + ")$", "i").exec(val);
        });
        validationProvider.addValidator("remote",(val: string, options: RemoteValidator) => {
            if (options.ngModel.remoteTimeout)
                options.ngModel.remoteTimeout.resolve();
            if (!val)
                return true;

            var prefix = getModelPrefix(options.attributes.name);
            var data: any = {};
            data[options.attributes.name] = val;
            (<ng.IAngularStatic>angular).forEach((options.parameters.additionalfields || '').split(','), (fieldName: string) => {
                var dataName = appendModelPrefix(fieldName, prefix);
                data[dataName] = options.injected.validation.dataValue(options.scope, dataName);
            });

            var timeout = options.injected.$q.defer();
            options.ngModel.remoteTimeout = timeout;
            options.injected.$http({
                method: options.parameters.type,
                url: options.parameters.url,
                data: data,
                cache: true, // we may want this off... but it should save repeated calls to our back-end
                timeout: timeout.promise,
                responseType: "json"
            }).success((response: any, status: number) => {
                if (response !== true && response !== "true") {
                    options.fail(response);
                }
            });
            return true;
        }, ['validation', '$http', '$q']);
    }

    configureValidationProvider.$inject = ['validationProvider'];

    mod.config(configureValidationProvider);
}