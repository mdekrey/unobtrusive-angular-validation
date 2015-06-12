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
            var ValBindMessagesDirective = (function () {
                function ValBindMessagesDirective(validation, $parse, $sce) {
                    var _this = this;
                    this.restrict = 'A';
                    this.link = function (scope, element, attrs) {
                        var model = _this.$parse(attrs['valBindMessages']);
                        var disposeWatch = [
                            scope.$watchCollection(attrs.valBindMessages, function (newValue) {
                                var validationScopeState = _this.validation.ensureValidation(scope);
                                var target = {};
                                validationScopeState.messages = target;
                                angular.forEach(newValue, function (entry) {
                                    target[entry.memberName] = target[entry.memberName] || [];
                                    target[entry.memberName].push(_this.$sce.trustAsHtml(entry.text));
                                });
                            })
                        ];
                        element.on('$destroy', function () {
                            angular.forEach(disposeWatch, function (d) { return d(); });
                        });
                    };
                    this.validation = validation;
                    this.$parse = $parse;
                    this.$sce = $sce;
                }
                ValBindMessagesDirective.Factory = (function () {
                    var result = function (validation, $parse, $sce) {
                        return new ValBindMessagesDirective(validation, $parse, $sce);
                    };
                    result.$inject = ['validation', '$parse', '$sce'];
                    return result;
                })();
                return ValBindMessagesDirective;
            })();
            Unobtrusive.mod.directive('valBindMessages', ValBindMessagesDirective.Factory);
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var ValErrorDirective = (function () {
                function ValErrorDirective(validation) {
                    var _this = this;
                    this.restrict = 'A';
                    this.link = function (scope, element, attrs) {
                        var disposeWatch = scope.$watchCollection(function () { return _this.validation.messageArray(scope, attrs['valError']); }, function (newValue) {
                            if (newValue && Object.keys(newValue).length) {
                                element.addClass('error');
                            }
                            else {
                                element.removeClass('error');
                            }
                        });
                        element.on('$destroy', function () { return disposeWatch(); });
                    };
                    this.validation = validation;
                }
                ValErrorDirective.Factory = (function () {
                    var result = function (validation) {
                        return new ValErrorDirective(validation);
                    };
                    result.$inject = ['validation'];
                    return result;
                })();
                return ValErrorDirective;
            })();
            Unobtrusive.mod.directive('valError', ValErrorDirective.Factory);
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
                    this.restrict = 'A';
                    this.require = '^?form';
                    this.link = function (scope, element, attrs, ctrl) {
                        element.on('click', function ($event) {
                            _this.validation.cancelSuppress(scope);
                            _this.validation.validationSummaryVisible(scope, true);
                            scope.$digest();
                            if (ctrl.$invalid) {
                                $event.preventDefault();
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
                ValSubmitDirective.Factory = (function () {
                    var result = function (validation) {
                        return new ValSubmitDirective(validation);
                    };
                    result.$inject = ['validation'];
                    return result;
                })();
                return ValSubmitDirective;
            })();
            Unobtrusive.mod.directive('valSubmit', ValSubmitDirective.Factory);
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var ValidatedFormDirective = (function () {
                function ValidatedFormDirective(validation) {
                    var _this = this;
                    this.restrict = 'E';
                    this.link = function (scope) {
                        _this.validation.ensureValidation(scope);
                    };
                    this.validation = validation;
                }
                ValidatedFormDirective.Factory = (function () {
                    var result = function (validation) {
                        return new ValidatedFormDirective(validation);
                    };
                    result.$inject = ['validation'];
                    return result;
                })();
                return ValidatedFormDirective;
            })();
            Unobtrusive.mod.directive('form', ValidatedFormDirective.Factory);
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
                function ValidationTools(attrs, ngModelController, svc, scope, $injector, $sce, getValidationType) {
                    var _this = this;
                    this.showValidationSummary = false;
                    this.validationEnabled = true;
                    this.buildValidatorsFromAttributes = function (attrs, scope, ngModel) {
                        var keys = Object.keys(attrs).sort();
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
                                    validator.parameters[camelCase(keyName.substr(validatorName.length))] = attrs[key];
                                    handled = true;
                                    return;
                                }
                            });
                            if (handled)
                                return;
                            var validate = _this.getValidationType(keyName);
                            if (validate) {
                                result[keyName] = new Unobtrusive.Validator(keyName, validate, _this.$sce.trustAsHtml(attrs[key]), attrs, scope, ngModel, _this, _this.$injector);
                            }
                            else {
                                console.log('WARNING: Unhandled validation attribute: ' + keyName);
                            }
                        });
                        return result;
                    };
                    this.runValidations = function (newValue) {
                        _this.svc.dataValue(_this.scope, _this.validationFor, newValue);
                        if (_this.validationEnabled) {
                            _this.ngModelController.validationMessages = {};
                            angular.forEach(_this.validators, function (value, key) {
                                if (!value.validate(newValue, value))
                                    value.fail();
                                else
                                    value.pass();
                            });
                            _this.populateMessages();
                        }
                        return newValue;
                    };
                    this.fail = function (key, message) {
                        if (_this.validationEnabled) {
                            _this.ngModelController.$setValidity(key, false);
                            _this.ngModelController.validationMessages[key] = message ? _this.$sce.trustAsHtml(message) : (_this.validators[key].message);
                        }
                    };
                    this.pass = function (key) {
                        _this.ngModelController.$setValidity(key, true);
                    };
                    this.validationFor = attrs['name'];
                    this.ngModelController = ngModelController;
                    this.svc = svc;
                    this.scope = scope;
                    this.$sce = $sce;
                    this.getValidationType = getValidationType;
                    this.$injector = $injector;
                    ngModelController.suppressValidationMessages = true;
                    ngModelController.validationMessages = {};
                    this.validators = this.buildValidatorsFromAttributes(attrs, scope, ngModelController);
                }
                ValidationTools.prototype.enable = function () {
                    this.validationEnabled = true;
                    this.runValidations(this.svc.dataValue(this.scope, this.validationFor));
                    this.populateMessages();
                };
                ValidationTools.prototype.disable = function () {
                    var _this = this;
                    this.validationEnabled = false;
                    this.ngModelController.validationMessages = {};
                    angular.forEach(this.validators, function (value, key) {
                        _this.pass(key);
                    });
                    this.populateMessages();
                };
                ValidationTools.prototype.populateMessages = function () {
                    if (!this.ngModelController.suppressValidationMessages) {
                        this.svc.messageArray(this.scope, this.validationFor, this.ngModelController.validationMessages);
                    }
                };
                ValidationTools.prototype.cancelSuppress = function () {
                    this.ngModelController.suppressValidationMessages = false;
                    this.populateMessages();
                };
                ValidationTools.prototype.enableSuppress = function () {
                    this.ngModelController.suppressValidationMessages = true;
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
                    this.restrict = 'A';
                    this.scope = {
                        valmsgFor: '@'
                    };
                    this.templateUrl = 'templates/angular-unobtrusive-validation/valmsgFor.html';
                    this.transclude = true;
                    this.link = function (scope, element) {
                        var watch = scope.$parent.$watchCollection(function () {
                            return _this.validation.messageArray(scope.$parent, scope.valmsgFor);
                        }, function (newValue) {
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
                        element.on('$destroy', function () { return watch(); });
                    };
                    this.validation = validation;
                }
                ValmsgForDirective.Factory = (function () {
                    var result = function (validation) {
                        return new ValmsgForDirective(validation);
                    };
                    result.$inject = ['validation'];
                    return result;
                })();
                return ValmsgForDirective;
            })();
            Unobtrusive.mod.directive('valmsgFor', ValmsgForDirective.Factory);
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
                function ValmsgSummaryDirective(validation, $sce) {
                    var _this = this;
                    this.restrict = 'A';
                    this.scope = {};
                    this.templateUrl = 'templates/angular-unobtrusive-validation/valmsgSummary.html';
                    this.transclude = true;
                    this.link = function (scope, element) {
                        scope.started = false;
                        scope.validationSummary = [];
                        var parentScope = scope.$parent;
                        var update = function () {
                            if (!_this.validation.validationSummaryVisible(parentScope))
                                return;
                            var rawHtml = [];
                            var merged = [];
                            var obj = _this.validation.messageArray(parentScope);
                            angular.forEach(obj, function (value, key) {
                                if (obj.hasOwnProperty(key)) {
                                    scope.started = true;
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
                        };
                        var watches = [
                            parentScope.$watchCollection(_this.validation.messageArray, update),
                            parentScope.$watch(function () { return _this.validation.validationSummaryVisible(parentScope); }, update)
                        ];
                        element.on('$destroy', function () { return angular.forEach(watches, function (watch) { return watch(); }); });
                    };
                    this.validation = validation;
                    this.sce = $sce;
                }
                ValmsgSummaryDirective.Factory = (function () {
                    var result = function (validation, $sce) {
                        return new ValmsgSummaryDirective(validation, $sce);
                    };
                    result.$inject = ['validation', '$sce'];
                    return result;
                })();
                return ValmsgSummaryDirective;
            })();
            Unobtrusive.mod.directive('valmsgSummary', ValmsgSummaryDirective.Factory);
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
                function ValDirective(validation) {
                    var _this = this;
                    this.restrict = 'A';
                    this.require = 'ngModel';
                    this.link = function (scope, element, attrs, ngModelController) {
                        if (attrs['val'] != 'true')
                            return;
                        var validationFor = attrs['name'];
                        var validators = _this.validation.buildValidation(scope, element, attrs, ngModelController);
                        ngModelController.$parsers.unshift(validators.runValidations);
                        ngModelController.$formatters.unshift(validators.runValidations);
                        var watches = [
                            scope.$watch(_this.validation.hasCancelledSuppress, function (newValue) {
                                if (newValue)
                                    validators.cancelSuppress();
                            })
                        ];
                        if (attrs['valIf']) {
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
                        element.on('$destroy', function () {
                            delete _this.validation.clearDotNetName(scope, validationFor);
                            for (var key in watches)
                                watches[key]();
                        });
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
                    this.validation = validation;
                }
                ValDirective.Factory = (function () {
                    var result = function (validation) {
                        return new ValDirective(validation);
                    };
                    result.$inject = ['validation'];
                    return result;
                })();
                return ValDirective;
            })();
            Unobtrusive.mod.directive('val', ValDirective.Factory);
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var validationTypes = {};
            var ValidationProvider = (function () {
                function ValidationProvider() {
                    this.$get.$inject = ['$injector'];
                }
                ValidationProvider.prototype.getValidationType = function (validatorName) {
                    return validationTypes[validatorName];
                };
                ValidationProvider.prototype.addValidator = function (validatorName, validate, inject) {
                    validationTypes[validatorName] = { validate: validate, inject: inject || [] };
                };
                ValidationProvider.prototype.$get = function ($injector) {
                    return $injector.instantiate(Unobtrusive.ValidationService, { 'getValidationType': this.getValidationType });
                };
                ValidationProvider.Factory = function () {
                    return new ValidationProvider();
                };
                return ValidationProvider;
            })();
            Unobtrusive.ValidationProvider = ValidationProvider;
            Unobtrusive.mod.provider('validation', ValidationProvider.Factory);
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var cancelSuppressionEvent = 'unobtrusiveValidation-supression-cancel';
            var showValidationSummaryEvent = 'unobtrusiveValidation-summary-show';
            var hideValidationSummaryEvent = 'unobtrusiveValidation-summary-hide';
            var ValidationService = (function () {
                function ValidationService($injector, $sce, getValidationType) {
                    var _this = this;
                    this.messageArray = function (scope, dotNetName, setter) {
                        if (dotNetName) {
                            if (setter !== undefined) {
                                _this.ensureValidation(scope).messages[dotNetName] = setter;
                            }
                            return _this.ensureValidation(scope).messages[dotNetName];
                        }
                        return _this.ensureValidation(scope).messages;
                    };
                    this.dataValue = function (scope, dotNetName, setter) {
                        if (dotNetName) {
                            if (setter !== undefined)
                                _this.ensureValidation(scope).data[dotNetName] = setter;
                            return _this.ensureValidation(scope).data[dotNetName];
                        }
                        return _this.ensureValidation(scope).data;
                    };
                    this.hasCancelledSuppress = function (scope) {
                        return _this.ensureValidation(scope).cancelSuppress;
                    };
                    this.$injector = $injector;
                    this.$sce = $sce;
                    this.getValidationType = getValidationType;
                }
                ValidationService.prototype.ensureValidation = function (scope) {
                    var state = scope['$$ validation'] || { cancelSuppress: false, messages: {}, data: {}, showValidationSummary: false };
                    scope.$on(cancelSuppressionEvent, function (event) {
                        state.cancelSuppress = true;
                    });
                    scope.$on(showValidationSummaryEvent, function (event) {
                        state.showValidationSummary = true;
                    });
                    scope.$on(hideValidationSummaryEvent, function (event) {
                        state.showValidationSummary = false;
                    });
                    scope['$$ validation'] = state;
                    return state;
                };
                ValidationService.prototype.buildValidation = function (scope, element, attrs, ngModelController) {
                    return new Unobtrusive.ValidationTools(attrs, ngModelController, this, scope, this.$injector, this.$sce, this.getValidationType);
                };
                ValidationService.prototype.cancelSuppress = function (scope) {
                    this.ensureValidation(scope).cancelSuppress = true;
                    scope.$broadcast(cancelSuppressionEvent);
                };
                ValidationService.prototype.clearDotNetName = function (scope, dotNetName) {
                    var validation = this.ensureValidation(scope);
                    delete this.ensureValidation(scope).messages[dotNetName];
                    delete this.ensureValidation(scope).data[dotNetName];
                };
                ValidationService.prototype.validationSummaryVisible = function (scope, value) {
                    if (value === undefined)
                        return this.ensureValidation(scope).showValidationSummary;
                    else {
                        this.ensureValidation(scope).showValidationSummary = value;
                        if (value)
                            scope.$broadcast(showValidationSummaryEvent);
                        else
                            scope.$broadcast(hideValidationSummaryEvent);
                    }
                };
                ValidationService.$inject = ['$injector', '$sce', 'getValidationType'];
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
                function Validator(keyName, validate, message, attributes, scope, ngModel, validationTools, $injector) {
                    var _this = this;
                    this.parameters = {};
                    this.injected = {};
                    this.name = keyName;
                    this.validate = validate.validate;
                    this.message = message;
                    this.attributes = attributes;
                    this.scope = scope;
                    this.ngModel = ngModel;
                    this.validationTools = validationTools;
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
                    var prefix = getModelPrefix(options.attributes.name), other = options.parameters.other, fullOtherName = appendModelPrefix(other, prefix), element = options.injected.validation.dataValue(options.scope, fullOtherName);
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
                        data[dataName] = options.injected.validation.dataValue(options.scope, dataName);
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
