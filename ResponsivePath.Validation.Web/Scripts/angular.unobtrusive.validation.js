(function () {
    'use strict';

    angular.module('unobtrusive.validation', [])

    .provider('validation', [function () {
        var validationTypes = {};

        function getValidationType(validatorName) {
            return validationTypes[validatorName];
        };

        this.$get = ['$injector', '$sce', function ($injector, $sce) {
            function startsWith(string, start) { return string.slice(0, start.length) == start; };
            function camelCase(string) { return string.charAt(0).toLowerCase() + string.slice(1); };

            // Aggregate our attributes for validation parameters. 
            // For example, valRegexPattern is a parameter of valRegex called "pattern".
            function buildValidatorsFromAttributes(attrs, tools, scope, ngModel) {
                var keys = Object.keys(attrs).sort();
                var result = {};
                angular.forEach(keys, function (key) {
                    if (key == 'val' || key == 'valIf' || key == 'valRealtime' || !startsWith(key, 'val'))
                        return;
                    var handled = false;
                    if (key.substr(3).charAt(0).toLowerCase() == key.substr(3).charAt(0)) {
                        // Check to make sure the next character is an upper-case character... keeps us from capturing data-value and things like that.
                        return;
                    }
                    var keyName = camelCase(key.substr(3));
                    angular.forEach(result, function (validator, validatorName) {
                        if (startsWith(keyName, validatorName)) {
                            validator.parameters[camelCase(keyName.substr(validatorName.length))] = attrs[key];
                            handled = true;
                            return;
                        }
                    });
                    if (handled)
                        return;

                    var validate = getValidationType(keyName);
                    if (validate) {
                        result[keyName] = {
                            name: keyName,
                            validate: validate.validate,
                            message: $sce.trustAsHtml(attrs[key]),
                            parameters: [],
                            injected: {},
                            attributes: attrs,
                            scope: scope,
                            ngModel: ngModel,
                            fail: function (message) { tools.fail(keyName, message); },
                            pass: function () { tools.pass(keyName); }
                        };
                        if (validate.inject) {
                            angular.forEach(validate.inject, function (name) {
                                result[keyName].injected[name] = $injector.get(name);
                            });
                        }
                    }
                    else {
                        console.log('WARNING: Unhandled validation attribute: ' + keyName);
                    }
                });
                return result;
            };

            var svc = {
                ensureValidation: function (scope) {
                    scope['$$ validation'] = scope['$$ validation'] || { cancelSuppress: false, messages: {}, data: {} };
                    return scope['$$ validation'];
                },
                buildValidation: function (scope, element, attrs, ngModelController) {
                    var validationEnabled = true;
                    var validationFor = attrs['name'];
                    ngModelController.suppressValidationMessages = true;
                    ngModelController.validationMessages = {};
                    var validators;

                    var result = {
                        enable: function () {
                            validationEnabled = true;
                            result.runValidations(svc.dataValue(scope, validationFor));
                            result.populateMessages();
                        },
                        disable: function () {
                            validationEnabled = false;
                            ngModelController.validationMessages = {};
                            angular.forEach(validators, function (value, key) {
                                result.pass(key);
                            })
                            result.populateMessages();
                        },
                        populateMessages: function () {
                            if (!ngModelController.suppressValidationMessages) {
                                svc.messageArray(scope, validationFor, ngModelController.validationMessages);
                            }
                        },
                        runValidations: function (newValue) {
                            svc.dataValue(scope, validationFor, newValue);
                            if (validationEnabled) {
                                ngModelController.validationMessages = {};
                                // Run validations for all of our client-side validation and store in a local array.
                                angular.forEach(validators, function (value, key) {
                                    if (!value.validate(newValue, value))
                                        value.fail();
                                    else
                                        value.pass();
                                });
                                result.populateMessages();
                            }
                            return newValue;
                        },
                        cancelSuppress: function () {
                            ngModelController.suppressValidationMessages = false;
                            result.populateMessages();
                        },
                        enableSuppress: function () {
                            ngModelController.suppressValidationMessages = true;
                            // don't re-populate the messages here
                        },
                        fail: function (key, message) {
                            if (validationEnabled) {
                                ngModelController.$setValidity(key, false);
                                ngModelController.validationMessages[key] = message ? $sce.trustAsHtml(message) : (validators[key].message);
                            }
                        },
                        pass: function (key) {
                            ngModelController.$setValidity(key, true);
                        },
                        showValidationSummary: false
                    };
                    validators = buildValidatorsFromAttributes(attrs, result, scope, ngModelController);
                    return result;
                },
                messageArray: function (scope, dotNetName, setter) {
                    if (dotNetName) {
                        if (setter !== undefined)
                            svc.ensureValidation(scope).messages[dotNetName] = setter;
                        return svc.ensureValidation(scope).messages[dotNetName];
                    }
                    return svc.ensureValidation(scope).messages;
                },
                dataValue: function (scope, dotNetName, setter) {
                    if (dotNetName) {
                        if (setter !== undefined)
                            svc.ensureValidation(scope).data[dotNetName] = setter;
                        return svc.ensureValidation(scope).data[dotNetName];
                    }
                    return svc.ensureValidation(scope).data;
                },
                hasCancelledSuppress: function (scope) {
                    return svc.ensureValidation(scope).cancelSuppress;
                },
                cancelSuppress: function (scope) {
                    svc.ensureValidation(scope).cancelSuppress = true;
                },
                clearDotNetName: function (scope, dotNetName) {
                    var validation = svc.ensureValidation(scope);
                    delete svc.ensureValidation(scope).messages[dotNetName];
                    delete svc.ensureValidation(scope).data[dotNetName];
                }
            };
            return svc;
        }];

        this.getValidationType = getValidationType;
        this.addValidator = function (validatorName, validate, inject) {
            validationTypes[validatorName] = { validate: validate, inject: inject };
        };
    }])

    .directive('val', ['validation', function (validation) {
        // Attribute to run validation on an element
        var link = function (scope, element, attrs, ngModelController) {
            if (attrs['val'] != 'true')
                return;

            var validationFor = attrs['name'];

            // If suppress is true, don't actually display any validation messages.
            var validators = validation.buildValidation(scope, element, attrs, ngModelController);

            ngModelController.$parsers.unshift(validators.runValidations);
            ngModelController.$formatters.unshift(validators.runValidations);

            var watches = [
                // Watch to see if the hasCancelledSuppress is set to true and, if it is, cancel our own suppression.
                scope.$watch(validation.hasCancelledSuppress, function (newValue) {
                    if (newValue)
                        validators.cancelSuppress();
                })
            ];

            if (attrs['valIf']) {
                // watch our "valIf" expression and, if it becomse falsy, turn off all of our validations.
                watches.push(scope.$watch(attrs['valIf'], function (newValue, oldValue) {
                    if (newValue)
                        validators.enable();
                    else
                        validators.disable();
                }));
            }
            else {
                validators.enable();
            }

            // Make sure we dispose all our 
            element.on('$destroy', function () {
                delete validation.clearDotNetName(scope, validationFor);

                for (var key in watches)
                    watches[key]();
            });

            // Cancel suppression of error messages for this element on blur
            element.on('blur', function () {
                validators.cancelSuppress();
                scope.$digest();
            });

            if (!attrs.hasOwnProperty('valRealtime')) {
                element.on('focus', function () {
                    validators.enableSuppress();
                });
            }
            else {
                element.on('focus', function () {
                    validators.cancelSuppress();
                    scope.$digest();
                });
            }
        };

        return {
            restrict: 'A',
            require: 'ngModel',
            link: link
        };
    }])

    .directive('form', ['validation', function (validation) {

        return {
            restrict: 'E',
            link: function (scope) {
                // Add the $$validation object at the form level so that we don't end up adding it
                // at an inner level, such as an ng-if.
                validation.ensureValidation(scope);
            }
        };
    }])

    .directive('valSubmit', ['validation', function (validation) {
        return {
            restrict: 'A',
            require: '^?form',
            link: function (scope, element, attrs, ctrl) {
                element.on('click', function ($event) {
                    if (ctrl.$invalid) {
                        $event.preventDefault();
                        validation.showValidationSummary = true;
                        // Cancels the suppression of validation messages, which reveals error classes, validation summaries, etc.
                        validation.cancelSuppress(scope);
                        scope.$digest();
                    }
                });

                var watches = [
                    scope.$watch(function () { return ctrl.$invalid }, function (newValue) {
                        if (newValue)
                            element.addClass('disabled');
                        else
                            element.removeClass('disabled');
                    })
                ];

                element.on('$destroy', function () {
                    for (var key in watches)
                        watches[key]();
                });
            }
        }
    }])

    .directive('valmsgSummary', ['validation', function (validation) {
        return {
            restrict: 'A',
            scope: {},
            templateUrl: 'templates/angular-unobtrusive-validation/valmsgSummary.html',
            transclude: true,
            link: function (scope, element) {
                scope.started = false;
                scope.validationSummary = [];
                // Here we don't need to dispose our watch because we have an isolated scope that goes away when the element does.
                var watch = scope.$parent.$watchCollection(validation.messageArray, function (newValue) {
                    if (!validation.showValidationSummary) return;
                    var merged = [];
                    // flatten the nested arrays into "merged"
                    var obj = newValue;
                    angular.forEach(obj, function (value, key) {
                        if (obj.hasOwnProperty(key)) {
                            scope.started = true;
                            angular.forEach(value, function (innerValue) {
                                if (innerValue && merged.indexOf(innerValue) == -1) {
                                    merged.push(innerValue);
                                }
                            });
                        }
                    });
                    scope.validationSummary = merged;
                    if (scope.started) {
                        if (!merged.length) {
                            element.addClass('validation-summary-valid');
                            element.removeClass('validation-summary-errors');
                        }
                        else {
                            element.removeClass('validation-summary-valid');
                            element.addClass('validation-summary-errors');
                        }
                    }
                });

                element.on('$destroy', function () { watch(); });
            }
        };
    }])

    .directive('valBindMessages', ['validation', '$parse', '$sce', function (validation, $parse, $sce) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.valBindMessages);

                var disposeWatch = [
                    scope.$watchCollection(attrs.valBindMessages, function (newValue) {
                        var target = validation.ensureValidation(scope).messages = {};

                        angular.forEach(newValue, function (entry) {
                            target[entry.memberName] = target[entry.memberName] || [];
                            target[entry.memberName].push($sce.trustAsHtml(entry.text));
                        });
                    })
                ];

                element.on('$destroy', function () {
                    angular.forEach(disposeWatch, function (d) { d(); });
                });
            }
        };
    }])

    .directive('valError', ['validation', function (validation) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var disposeWatch = scope.$watchCollection(function () { return validation.messageArray(scope, attrs['valError']) }, function (newValue) {
                    if (newValue && Object.keys(newValue).length) {
                        element.addClass('error');
                    }
                    else {
                        element.removeClass('error');
                    }
                });

                element.on('$destroy', function () {
                    disposeWatch();
                });
            }
        };
    }])

    .directive('valmsgFor', ['validation', function (validation) {

        return {
            restrict: 'A',
            scope: {
                valmsgFor: '@'
            },
            templateUrl: 'templates/angular-unobtrusive-validation/valmsgFor.html',
            transclude: true,
            link: function (scope, element) {
                scope.validationSummary = [];
                // Here we don't need to dispose our watch because we have an isolated scope that goes away when the element does.
                var watch = scope.$parent.$watchCollection(function () { return validation.messageArray(scope.$parent, scope.valmsgFor) }, function (newValue) {
                    scope.messages = newValue;
                    if (newValue !== undefined) {
                        scope.started = true;
                    }

                    if (scope.started) {
                        if (newValue && !Object.keys(newValue).length) {
                            element.addClass('field-validation-valid');
                            element.removeClass('field-validation-error');
                        }
                        else {
                            element.removeClass('field-validation-valid');
                            element.addClass('field-validation-error');
                        }
                    }
                });

                element.on('$destroy', function () { watch(); });
            }
        };
    }])

    .config(['validationProvider', function (validationProvider) {

        function getModelPrefix(fieldName) {
            return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
        }

        function appendModelPrefix(value, prefix) {
            if (value.indexOf("*.") === 0) {
                value = value.replace("*.", prefix);
            }
            return value;
        }

        validationProvider.addValidator('required', function (val) { return !!val; });
        validationProvider.addValidator('regex', function (val, options) {
            return !val || new RegExp(options.parameters['pattern']).exec(val);
        });
        validationProvider.addValidator('email', function (val) {
            // regex taken from jquery.validate v1.12.0
            // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
            // Retrieved 2014-01-14
            // If you have a problem with this implementation, report a bug against the above spec
            // Or use custom methods to implement your own email validation
            return !val || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(val);
        });
        validationProvider.addValidator("creditcard", function (value) {
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
                n, cDigit;

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
        validationProvider.addValidator("date", function (val) {
            if (!val)
                return true;
            return !/Invalid|NaN/.test(new Date(val).toString());
        });
        validationProvider.addValidator("digits", function (val) {
            if (!val)
                return true;
            return /^\d+$/.test(val);
        });
        validationProvider.addValidator("number", function (val) {
            if (!val)
                return true;
            return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(val);
        });
        validationProvider.addValidator("url", function (val) {
            if (!val)
                return true;
            // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
            return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(val);
        });
        validationProvider.addValidator("minlength", function (val, options) {
            if (!val)
                return true;
            return val.length >= parseInt(options.parameters.min);
        });
        validationProvider.addValidator("maxlength", function (val, options) {
            if (!val)
                return true;
            return val.length <= parseInt(options.parameters.max);
        });
        validationProvider.addValidator("length", function (val, options) {
            if (!val)
                return true;
            return (!options.parameters.min || val.length >= parseInt(options.parameters.min))
                && (!options.parameters.max || val.length <= parseInt(options.parameters.max));
        });
        validationProvider.addValidator("range", function (val, options) {
            if (!val)
                return true;

            var value = parseFloat(val);
            return value <= parseFloat(options.parameters.max) && value >= parseFloat(options.parameters.min);
        });
        validationProvider.addValidator("password", function (val, options) {
            function nonalphamin(value, min) {
                var match = value.match(/\W/g);
                return match && match.length >= min;
            }
            if (!val)
                return true;
            return (!options.parameters.min || val.length >= options.parameters.min)
                && (!options.parameters.nonalphamin || nonalphamin(val, options.parameters.nonalphamin))
                && (!options.parameters.regex || !!(new RegExp(options.parameters.regex).exec(val)));
        });
        validationProvider.addValidator("equalto", function (val, options) {
            var prefix = getModelPrefix(options.attributes.name),
                other = options.parameters.other,
                fullOtherName = appendModelPrefix(other, prefix),
                element = options.injected.validation.dataValue(options.scope, fullOtherName);

            return element == val;
        }, ['validation']);
        validationProvider.addValidator("extension", function (val, options) {
            if (!val)
                return true;
            var param = typeof options.parameters.extension == "string" ? options.parameters.extension.replace(/,/g, '|') : "png|jpe?g|gif";
            return val.match(new RegExp("\\.(" + param + ")$", "i"));
        });
        validationProvider.addValidator("remote", function (val, options) {
            if (options.ngModel.remoteTimeout)
                options.ngModel.remoteTimeout.resolve();
            if (!val)
                return true;

            var prefix = getModelPrefix(options.attributes.name);
            var data = {};
            data[options.attributes.name] = val;
            angular.forEach((options.parameters.additionalfields || '').split(','), function (fieldName) {
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
            }).success(function (response, status) {
                if (response !== true && response !== "true") {
                    options.fail(response);
                }
            });
            return true;
        }, ['validation', '$http', '$q']);
    }])

    .run(function ($templateCache) {
        $templateCache.put("templates/angular-unobtrusive-validation/valmsgSummary.html",
            '<div class="alert alert-error" ng-if="started" ng-show="validationSummary.length">' +
            '   <ul>' +
            '       <li data-ng-repeat="err in validationSummary" data-ng-bind-html="err"></span>' +
            '   </ul>' +
            '</div>' +
            '<div class="alert alert-error" ng-transclude ng-if="!started"></div>'
        );

        $templateCache.put("templates/angular-unobtrusive-validation/valmsgFor.html", '<span for="{{valmsgFor}}" data-ng-repeat="err in messages" generated="true" data-ng-bind-html="err"></span><span ng-transclude ng-if="!messages"></span>');
    });
})();