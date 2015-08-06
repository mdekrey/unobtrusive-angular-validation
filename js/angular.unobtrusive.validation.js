var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            function constructorAsInjectable(targetClass) {
                var result = function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    var obj = Object.create(targetClass.prototype);
                    targetClass.apply(obj, args);
                    return obj;
                };
                result.$inject = targetClass.$inject;
                return result;
            }
            Unobtrusive.constructorAsInjectable = constructorAsInjectable;
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            Unobtrusive.mod = angular.module('unobtrusive.validation', []);
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var ValSubmitDirective = (function () {
                function ValSubmitDirective(validation) {
                    var _this = this;
                    this.validation = validation;
                    this.restrict = 'A';
                    this.require = '^?form';
                    this.link = function (scope, element, attrs, ctrl) {
                        element.on('click', function ($event) {
                            _this.validation.ensureValidation(ctrl).submitted();
                            scope.$digest();
                            if (ctrl.$invalid) {
                                $event.preventDefault();
                                if (_this.validation.getShouldSetFormSubmitted()) {
                                    ctrl.$setSubmitted();
                                    scope.$digest();
                                }
                            }
                        });
                        var watches = [
                            scope.$watch(function () { return ctrl && ctrl.$invalid; }, function (newValue) {
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
                    };
                    this.validation = validation;
                }
                ValSubmitDirective.$inject = ['validation'];
                return ValSubmitDirective;
            })();
            Unobtrusive.mod.directive('valSubmit', Unobtrusive.constructorAsInjectable(ValSubmitDirective));
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            function startsWith(values, start) {
                return values.slice(0, start.length) == start;
            }
            ;
            function camelCase(text) {
                return text.charAt(0).toLowerCase() + text.slice(1);
            }
            ;
            var ValidationTools = (function () {
                function ValidationTools(attrs, ngModelController, svc, formController, $injector, $sce, getValidationType) {
                    var _this = this;
                    this.attrs = attrs;
                    this.ngModelController = ngModelController;
                    this.svc = svc;
                    this.formController = formController;
                    this.$injector = $injector;
                    this.$sce = $sce;
                    this.getValidationType = getValidationType;
                    this.showValidationSummary = false;
                    this.validationEnabled = true;
                    this.runValidations = function (newValue) {
                        if (_this.validationEnabled) {
                            angular.forEach(_this.validators, function (value, key) {
                                if (!value.validate(newValue, value))
                                    value.fail();
                                else
                                    value.pass();
                            });
                        }
                        return newValue;
                    };
                    this.fail = function (key, message) {
                        if (_this.validationEnabled) {
                            _this.ngModelController.$setValidity(key, false);
                        }
                        if (message) {
                            _this.ngModelController.overrideValidationMessages[key] = _this.$sce.trustAsHtml(message);
                        }
                        else {
                            _this.ngModelController.overrideValidationMessages[key] = null;
                        }
                    };
                    this.pass = function (key) {
                        _this.ngModelController.$setValidity(key, true);
                    };
                    this.validationFor = attrs['name'];
                    ngModelController.allValidationMessages = {};
                    ngModelController.overrideValidationMessages = {};
                    this.validators = this.buildValidatorsFromAttributes();
                }
                ValidationTools.prototype.enable = function () {
                    this.validationEnabled = true;
                    this.runValidations(this.formController[this.validationFor].$modelValue);
                };
                ValidationTools.prototype.disable = function () {
                    var _this = this;
                    this.validationEnabled = false;
                    angular.forEach(this.validators, function (value, key) {
                        _this.pass(key);
                    });
                };
                ValidationTools.prototype.buildValidatorsFromAttributes = function () {
                    var _this = this;
                    var keys = Object.keys(this.attrs).sort();
                    var result = {};
                    angular.forEach(keys, function (key) {
                        if (key == 'val' || key == 'valIf' || key == 'valRealtime' || !startsWith(key, 'val'))
                            return;
                        var handled = false;
                        if (key.substr(3).charAt(0).toLowerCase() == key.substr(3).charAt(0)) {
                            return;
                        }
                        var keyName = camelCase(key.substr(3));
                        angular.forEach(result, function (validator, validatorName) {
                            if (startsWith(keyName, validatorName)) {
                                validator.parameters[camelCase(keyName.substr(validatorName.length))] = _this.attrs[key];
                                handled = true;
                                return;
                            }
                        });
                        if (handled)
                            return;
                        var validate = _this.getValidationType(keyName);
                        if (validate) {
                            _this.ngModelController.allValidationMessages[keyName] = _this.$sce.trustAsHtml(_this.attrs[key]);
                            result[keyName] = new Unobtrusive.Validator(keyName, validate, _this.attrs, _this.formController, _this.ngModelController, _this, _this.$injector);
                        }
                        else {
                            console.log('WARNING: Unhandled validation attribute: ' + keyName);
                        }
                    });
                    return result;
                };
                return ValidationTools;
            })();
            Unobtrusive.ValidationTools = ValidationTools;
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var ValmsgForDirective = (function () {
                function ValmsgForDirective(validation) {
                    var _this = this;
                    this.validation = validation;
                    this.restrict = 'A';
                    this.require = '^form';
                    this.scope = {
                        valmsgFor: '@'
                    };
                    this.templateUrl = 'templates/angular-unobtrusive-validation/valmsgFor.html';
                    this.transclude = true;
                    this.link = function (scope, element, attrs, controller) {
                        var modelController = controller[scope.valmsgFor];
                        scope.$parent.$watchCollection(function () {
                            return modelController.$invalid && _this.validation.activeMessageArray(controller, scope.valmsgFor);
                        }, function (newValue) {
                            if (!newValue) {
                                scope.messages = {};
                                element.addClass('field-validation-valid');
                                element.removeClass('field-validation-error');
                                return;
                            }
                            scope.messages = newValue;
                            if (newValue && !_.any(newValue)) {
                                element.addClass('field-validation-valid');
                                element.removeClass('field-validation-error');
                            }
                            else {
                                element.removeClass('field-validation-valid');
                                element.addClass('field-validation-error');
                            }
                        });
                    };
                }
                ValmsgForDirective.$inject = ['validation'];
                return ValmsgForDirective;
            })();
            Unobtrusive.mod.directive('valmsgFor', Unobtrusive.constructorAsInjectable(ValmsgForDirective));
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var ValmsgSummaryDirective = (function () {
                function ValmsgSummaryDirective(validation, sce) {
                    var _this = this;
                    this.validation = validation;
                    this.sce = sce;
                    this.restrict = 'A';
                    this.scope = {};
                    this.templateUrl = 'templates/angular-unobtrusive-validation/valmsgSummary.html';
                    this.transclude = true;
                    this.require = '^form';
                    this.link = function (scope, element, attrs, controller) {
                        scope.validationSummary = [];
                        scope.submitted = false;
                        var parentScope = scope.$parent;
                        var update = function () {
                            var rawHtml = [];
                            var merged = [];
                            var obj = _this.validation.activeMessageArray(controller);
                            angular.forEach(obj, function (value, key) {
                                if (obj.hasOwnProperty(key)) {
                                    angular.forEach(value, function (innerValue) {
                                        var rawValue = _this.sce.getTrustedHtml(innerValue);
                                        if (innerValue && rawValue && rawHtml.indexOf(rawValue) == -1) {
                                            rawHtml.push(rawValue);
                                            merged.push(innerValue);
                                        }
                                    });
                                }
                            });
                            scope.validationSummary = merged;
                            if (scope.submitted) {
                                if (!merged.length) {
                                    element.addClass('validation-summary-valid');
                                    element.removeClass('validation-summary-errors');
                                }
                                else {
                                    element.removeClass('validation-summary-valid');
                                    element.addClass('validation-summary-errors');
                                }
                            }
                        };
                        var watches = [
                            scope.$watch(function () { return controller.$error; }, update, true),
                            scope.$watch(function () { return _this.validation.ensureValidation(controller).activeErrors; }, function (newValue) {
                                scope.submitted = !!newValue;
                                update();
                            }),
                        ];
                        element.on('$destroy', function () { return angular.forEach(watches, function (watch) { return watch(); }); });
                    };
                }
                ValmsgSummaryDirective.$inject = ['validation', '$sce'];
                return ValmsgSummaryDirective;
            })();
            Unobtrusive.mod.directive('valmsgSummary', Unobtrusive.constructorAsInjectable(ValmsgSummaryDirective));
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var FormDirective = (function () {
                function FormDirective(validation) {
                    var _this = this;
                    this.validation = validation;
                    this.restrict = 'E';
                    this.require = 'form';
                    this.link = function (scope, element, attrs, form) {
                        form.$$validationState = {
                            blurErrors: null,
                            submittedErrors: null,
                            activeErrors: {},
                            activeErrorsByModel: {},
                            blurred: function () {
                                form.$$validationState.blurErrors = FormDirective.copyErrors(form.$error);
                            },
                            submitted: function () {
                                angular.forEach(Unobtrusive.ValidationService.getModelNames(form), function (modelName) {
                                    form[modelName].submittedErrors = angular.copy(form[modelName].$error);
                                });
                                form.$$validationState.submittedErrors = FormDirective.copyErrors(form.$error);
                            }
                        };
                        _this.validation.getValidationTiming().registerForm(scope, element, form);
                    };
                }
                FormDirective.copyErrors = function (errors) {
                    var result = {};
                    angular.forEach(errors, function (val, key) {
                        result[key] = val.slice(0);
                    });
                    return result;
                };
                FormDirective.$inject = ['validation'];
                return FormDirective;
            })();
            Unobtrusive.mod.directive('form', Unobtrusive.constructorAsInjectable(FormDirective));
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            ;
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var NgModelDirective = (function () {
                function NgModelDirective(validation) {
                    var _this = this;
                    this.validation = validation;
                    this.restrict = 'A';
                    this.require = ['ngModel', '^?form'];
                    this.link = function (scope, element, attrs, controllers) {
                        var ngModelController = controllers[0];
                        var form = controllers[1];
                        ngModelController.blurErrors = {};
                        ngModelController.submittedErrors = {};
                        var watches = [
                            scope.$watchCollection(function () { return ngModelController.activeErrors; }, function (newActiveErrors) {
                                if (newActiveErrors && Object.keys(newActiveErrors).length) {
                                    element.addClass(_this.validation.getDelayedInvalidClass());
                                    element.removeClass(_this.validation.getDelayedValidClass());
                                }
                                else {
                                    element.removeClass(_this.validation.getDelayedInvalidClass());
                                    element.addClass(_this.validation.getDelayedValidClass());
                                }
                            }),
                        ];
                        _this.validation.getValidationTiming().registerModel(scope, element, ngModelController, form);
                        var validationFor = attrs['name'];
                        element.on('$destroy', function () {
                            if (form) {
                                _this.validation.clearModelName(form, validationFor);
                            }
                            for (var key in watches)
                                watches[key]();
                        });
                        element.on('blur', function () {
                            ngModelController.blurErrors = angular.copy(ngModelController.$error);
                            if (form) {
                                form.$$validationState.blurred();
                            }
                            scope.$digest();
                        });
                    };
                }
                NgModelDirective.$inject = ['validation'];
                return NgModelDirective;
            })();
            Unobtrusive.mod.directive('ngModel', Unobtrusive.constructorAsInjectable(NgModelDirective));
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var ValDirective = (function () {
                function ValDirective(validation, parse) {
                    var _this = this;
                    this.validation = validation;
                    this.parse = parse;
                    this.restrict = 'A';
                    this.require = ['ngModel', '^form'];
                    this.link = function (scope, element, attrs, controllers) {
                        var ngModelController = controllers[0];
                        var form = controllers[1];
                        var isEnabledParse = _this.parse(attrs['val']);
                        var isEnabled = isEnabledParse(scope);
                        var additionalIfEnabled = true;
                        ngModelController.overrideValidationMessages = {};
                        function updateEnabled() {
                            if (isEnabled && additionalIfEnabled) {
                                validators.enable();
                            }
                            else {
                                validators.disable();
                            }
                        }
                        var watches = [
                            scope.$watch(function () { return isEnabledParse(scope); }, function (newValue) {
                                isEnabled = newValue;
                                updateEnabled();
                            }),
                        ];
                        if (attrs['valIf']) {
                            var additionalIfEnabledParse = _this.parse(attrs['valIf']);
                            watches.push(scope.$watch(function () { return additionalIfEnabledParse(scope); }, function (newValue) {
                                additionalIfEnabled = newValue;
                                updateEnabled();
                            }));
                        }
                        var validators = _this.validation.buildValidation(form, element, attrs, ngModelController);
                        ngModelController.$parsers.unshift(validators.runValidations);
                        ngModelController.$formatters.unshift(validators.runValidations);
                        element.on('$destroy', function () {
                            for (var key in watches)
                                watches[key]();
                        });
                    };
                }
                ValDirective.$inject = ['validation', '$parse'];
                return ValDirective;
            })();
            Unobtrusive.mod.directive('val', Unobtrusive.constructorAsInjectable(ValDirective));
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var ValidationTiming;
            (function (ValidationTiming) {
                ValidationTiming.Realtime = {
                    registerForm: function (scope, element, form) {
                        form.$$validationState.activeErrors = form.$error;
                    },
                    registerModel: function (scope, element, model, form) {
                        model.activeErrors = model.$error;
                    }
                };
                ValidationTiming.OnBlur = {
                    registerForm: function (scope, element, form) {
                        var watch = scope.$watch(function () { return form.$$validationState.blurErrors; }, function () { return form.$$validationState.activeErrors = form.$$validationState.blurErrors; }, true);
                        element.on('$destroy', function () { return watch(); });
                    },
                    registerModel: function (scope, element, model, form) {
                        var watch = scope.$watch(function () { return model.blurErrors; }, function () { return model.activeErrors = model.blurErrors; }, true);
                        element.on('$destroy', function () { return watch(); });
                    }
                };
                ValidationTiming.OnSubmit = {
                    registerForm: function (scope, element, form) {
                        var watch = scope.$watch(function () { return form.$$validationState.submittedErrors; }, function () { return form.$$validationState.activeErrors = form.$$validationState.submittedErrors; }, true);
                        element.on('$destroy', function () { return watch(); });
                    },
                    registerModel: function (scope, element, model, form) {
                        var watch = scope.$watch(function () { return model.submittedErrors; }, function () { return model.activeErrors = model.submittedErrors; }, true);
                        element.on('$destroy', function () { return watch(); });
                    }
                };
                ValidationTiming.DotNet = {
                    registerForm: function (scope, element, form) {
                        var watch = scope.$watch(function () { return form.$$validationState.submittedErrors; }, function () { return form.$$validationState.activeErrors = form.$$validationState.submittedErrors; }, true);
                        element.on('$destroy', function () { return watch(); });
                    },
                    registerModel: function (scope, element, model, form) {
                        var watch = scope.$watch(function () { return model.blurErrors; }, function () { return model.activeErrors = model.blurErrors; }, true);
                        element.on('$destroy', function () { return watch(); });
                    }
                };
            })(ValidationTiming = Unobtrusive.ValidationTiming || (Unobtrusive.ValidationTiming = {}));
            var ValidationProvider = (function () {
                function ValidationProvider() {
                    this.validationTypes = {};
                    this.timing = ValidationTiming.Realtime;
                    this.shouldSetFormSubmitted = true;
                    this.delayedValidClass = 'ng-delayed-valid';
                    this.delayedInvalidClass = 'ng-delayed-invalid';
                    this.$get.$inject = ['$injector'];
                }
                ValidationProvider.prototype.getValidationType = function (validatorName) {
                    return this.validationTypes[validatorName];
                };
                ValidationProvider.prototype.addValidator = function (validatorName, validate, inject) {
                    this.validationTypes[validatorName] = { validate: validate, inject: inject || [] };
                };
                ValidationProvider.prototype.$get = function ($injector) {
                    var _this = this;
                    return $injector.instantiate(Unobtrusive.ValidationService, {
                        'getValidationType': function (validatorName) { return _this.getValidationType(validatorName); },
                        'validationMessagingTiming': this.timing,
                        'shouldSetFormSubmitted': this.shouldSetFormSubmitted,
                        'delayedValidClass': this.delayedValidClass,
                        'delayedInvalidClass': this.delayedInvalidClass,
                    });
                };
                ValidationProvider.prototype.setValidationMessagingTiming = function (timing) {
                    this.timing = timing;
                };
                ValidationProvider.prototype.setShouldSetFormSubmitted = function (shouldSetFormSubmitted) {
                    this.shouldSetFormSubmitted = shouldSetFormSubmitted;
                };
                ValidationProvider.prototype.setValidityClasses = function (delayedValidClass, delayedInvalidClass) {
                    this.delayedValidClass = delayedValidClass;
                    this.delayedInvalidClass = delayedInvalidClass;
                };
                ValidationProvider.$inject = [];
                return ValidationProvider;
            })();
            Unobtrusive.ValidationProvider = ValidationProvider;
            Unobtrusive.mod.provider('validation', Unobtrusive.constructorAsInjectable(ValidationProvider));
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var ValidationService = (function () {
                function ValidationService($injector, $sce, getValidationType, validationMessagingTiming, shouldSetFormSubmitted, delayedValidClass, delayedInvalidClass) {
                    var _this = this;
                    this.$injector = $injector;
                    this.$sce = $sce;
                    this.getValidationType = getValidationType;
                    this.validationMessagingTiming = validationMessagingTiming;
                    this.shouldSetFormSubmitted = shouldSetFormSubmitted;
                    this.delayedValidClass = delayedValidClass;
                    this.delayedInvalidClass = delayedInvalidClass;
                    this.messageArray = function (formController, modelName) {
                        if (modelName) {
                            return formController[modelName].allValidationMessages;
                        }
                        var result = {};
                        angular.forEach(ValidationService.getModelNames(formController), function (modelName) {
                            result[modelName] = formController[modelName].allValidationMessages;
                        });
                        return result;
                    };
                    this.activeMessageArray = function (formController, modelName) {
                        if (modelName) {
                            var modelController = formController[modelName];
                            var result = {};
                            angular.forEach(modelController.activeErrors, function (value, key) {
                                var message = modelController.overrideValidationMessages[key] || modelController.allValidationMessages[key];
                                if (value && message) {
                                    result[key] = message;
                                }
                            });
                            return result;
                        }
                        else {
                            var resultSet = {};
                            angular.forEach(ValidationService.getModelNames(formController), function (modelName) {
                                resultSet[modelName] = _this.activeMessageArray(formController, modelName);
                            });
                            return resultSet;
                        }
                    };
                }
                ValidationService.prototype.ensureValidation = function (formController) {
                    var controller = formController;
                    return controller.$$validationState;
                };
                ValidationService.prototype.getValidation = function (validationType) {
                    return angular.copy(this.getValidationType(validationType));
                };
                ValidationService.prototype.buildValidation = function (formController, element, attrs, ngModelController) {
                    return new Unobtrusive.ValidationTools(attrs, ngModelController, this, formController, this.$injector, this.$sce, this.getValidationType);
                };
                ValidationService.prototype.clearModelName = function (formController, modelName) {
                    delete formController[modelName];
                };
                ValidationService.prototype.getValidationTiming = function () {
                    return this.validationMessagingTiming;
                };
                ValidationService.prototype.getShouldSetFormSubmitted = function () {
                    return this.shouldSetFormSubmitted;
                };
                ValidationService.getModelNames = function (formController) {
                    var result = [];
                    angular.forEach(Object.keys(formController), function (key) {
                        if (key[0] == '$')
                            return;
                        if (formController[key].$error) {
                            result.push(key);
                        }
                    });
                    return result;
                };
                ValidationService.prototype.getDelayedValidClass = function () {
                    return this.delayedValidClass;
                };
                ValidationService.prototype.getDelayedInvalidClass = function () {
                    return this.delayedInvalidClass;
                };
                ValidationService.$inject = ['$injector', '$sce', 'getValidationType', 'validationMessagingTiming', 'shouldSetFormSubmitted', 'delayedValidClass', 'delayedInvalidClass'];
                return ValidationService;
            })();
            Unobtrusive.ValidationService = ValidationService;
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var Validator = (function () {
                function Validator(name, validate, attributes, formController, ngModel, validationTools, $injector) {
                    var _this = this;
                    this.name = name;
                    this.attributes = attributes;
                    this.formController = formController;
                    this.ngModel = ngModel;
                    this.validationTools = validationTools;
                    this.parameters = {};
                    this.injected = {};
                    this.validate = validate.validate;
                    if (validate.inject) {
                        angular.forEach(validate.inject, function (name) {
                            _this.injected[name] = $injector.get(name);
                        });
                    }
                }
                Validator.prototype.fail = function (message) {
                    this.validationTools.fail(this.name, message);
                };
                Validator.prototype.pass = function () {
                    this.validationTools.pass(this.name);
                };
                return Validator;
            })();
            Unobtrusive.Validator = Validator;
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            function getModelPrefix(fieldName) {
                return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
            }
            function appendModelPrefix(value, prefix) {
                if (value.indexOf("*.") === 0) {
                    value = value.replace("*.", prefix);
                }
                return value;
            }
            function configureValidationProvider(validationProvider) {
                validationProvider.addValidator('required', function (val) {
                    return !!val;
                });
                validationProvider.addValidator('regex', function (val, options) {
                    return !val || !!new RegExp(options.parameters.pattern).exec(val);
                });
                validationProvider.addValidator('email', function (val) {
                    return !val || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(val);
                });
                validationProvider.addValidator("creditcard", function (value) {
                    if (!value)
                        return true;
                    if (/[^0-9 \-]+/.test(value)) {
                        return false;
                    }
                    var nCheck = 0, nDigit = 0, bEven = false, n, cDigit;
                    value = value.replace(/\D/g, "");
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
                    return (!options.parameters.min || val.length >= parseInt(options.parameters.min)) && (!options.parameters.max || val.length <= parseInt(options.parameters.max));
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
                    return (!options.parameters.min || val.length >= parseInt(options.parameters.min)) && (!options.parameters.nonalphamin || nonalphamin(val, parseInt(options.parameters.nonalphamin))) && (!options.parameters.regex || !!(new RegExp(options.parameters.regex).exec(val)));
                });
                validationProvider.addValidator("equalto", function (val, options) {
                    var prefix = getModelPrefix(options.attributes.name), other = options.parameters.other, fullOtherName = appendModelPrefix(other, prefix), element = options.formController[fullOtherName].$modelValue;
                    return element == val;
                }, ['validation']);
                validationProvider.addValidator("extension", function (val, options) {
                    if (!val)
                        return true;
                    var param = typeof options.parameters.extension == "string" ? options.parameters.extension.replace(/,/g, '|') : "png|jpe?g|gif";
                    return !!new RegExp("\\.(" + param + ")$", "i").exec(val);
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
                        data[dataName] = options.formController[dataName].$modelValue;
                    });
                    var timeout = options.injected.$q.defer();
                    options.ngModel.remoteTimeout = timeout;
                    options.injected.$http({
                        method: options.parameters.type,
                        url: options.parameters.url,
                        data: data,
                        cache: true,
                        timeout: timeout.promise,
                        responseType: "json"
                    }).success(function (response, status) {
                        if (response !== true && response !== "true") {
                            options.fail(response);
                        }
                    });
                    return true;
                }, ['validation', '$http', '$q']);
            }
            configureValidationProvider.$inject = ['validationProvider'];
            Unobtrusive.mod.config(configureValidationProvider);
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
