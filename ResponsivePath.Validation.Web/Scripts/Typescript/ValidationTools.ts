module ResponsivePath.Validation.Unobtrusive {
    function startsWith(values: string, start: string): boolean {
        return values.slice(0, start.length) == start;
    };
    function camelCase(text: string) {
        return text.charAt(0).toLowerCase() + text.slice(1);
    };

    export class ValidationTools {
        showValidationSummary: boolean = false;
        private validationEnabled: boolean = true;

        private validationFor: string;
        private ngModelController: IValidatedModelController;
        private validators: ValidatorCollection;
        private svc: ValidationService;
        private scope: ng.IScope;
        private $injector: ng.auto.IInjectorService;
        private $sce: IMySCEService;
        private getValidationType: (keyName: string) => ValidationType;

        // Aggregate our attributes for validation parameters. 
        // For example, valRegexPattern is a parameter of valRegex called "pattern".
        private buildValidatorsFromAttributes = (attrs: ng.IAttributes, scope: ng.IScope, ngModel: IValidatedModelController): ValidatorCollection => {
            var keys: string[] = Object.keys(attrs).sort();
            var result: ValidatorCollection = {};
            (<ng.IAngularStatic>angular).forEach(keys, (key) => {
                if (key == 'val' || key == 'valIf' || key == 'valRealtime' || !startsWith(key, 'val'))
                    return;
                var handled = false;
                if (key.substr(3).charAt(0).toLowerCase() == key.substr(3).charAt(0)) {
                    // Check to make sure the next character is an upper-case character... keeps us from capturing data-value and things like that.
                    return;
                }
                var keyName = camelCase(key.substr(3));
                (<ng.IAngularStatic>angular).forEach(result, (validator, validatorName) => {
                    // go back through previous validators and add as parameters if it matches
                    if (startsWith(keyName, validatorName)) {
                        validator.parameters[camelCase(keyName.substr(validatorName.length))] = attrs[key];
                        handled = true;
                        return;
                    }
                });
                if (handled)
                    return;

                // wasn't a validator parameter, so add it to our list
                var validate: ValidationType = this.getValidationType(keyName);
                if (validate) {
                    result[keyName] = new Validator(keyName, validate, this.$sce.trustAsHtml(attrs[key]), attrs, scope, ngModel, this, this.$injector);
                }
                else {
                    console.log('WARNING: Unhandled validation attribute: ' + keyName);
                }
            });
            return result;
        }

        constructor(attrs: ng.IAttributes, ngModelController: IValidatedModelController, svc: ValidationService, scope: ng.IScope, $injector: ng.auto.IInjectorService, $sce: IMySCEService, getValidationType: (keyName: string) => ValidationType) {
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

        enable(): void {
            this.validationEnabled = true;
            this.runValidations(this.svc.dataValue(this.scope, this.validationFor));
            this.populateMessages();
        }
        disable(): void {
            this.validationEnabled = false;
            this.ngModelController.validationMessages = {};
            (<ng.IAngularStatic>angular).forEach(this.validators, (value, key) => {
                this.pass(key);
            })
            this.populateMessages();
        }
        populateMessages(): void {
            if (!this.ngModelController.suppressValidationMessages) {
                this.svc.messageArray(this.scope, this.validationFor, this.ngModelController.validationMessages);
            }
        }
        runValidations = (newValue: any) => {
            this.svc.dataValue(this.scope, this.validationFor, newValue);
            if (this.validationEnabled) {
                this.ngModelController.validationMessages = {};
                // Run validations for all of our client-side validation and store in a local array.
                (<ng.IAngularStatic>angular).forEach(this.validators, (value, key) => {
                    if (!value.validate(newValue, value))
                        value.fail();
                    else
                        value.pass();
                });
                this.populateMessages();
            }
            return newValue;
        }
        cancelSuppress(): void {
            this.ngModelController.suppressValidationMessages = false;
            this.populateMessages();
        }
        enableSuppress(): void {
            this.ngModelController.suppressValidationMessages = true;
            // don't re-populate the messages here
        }
        fail = (key: string, message: string): void => {
            if (this.validationEnabled) {
                this.ngModelController.$setValidity(key, false);
                this.ngModelController.validationMessages[key] = message ? this.$sce.trustAsHtml(message) : (this.validators[key].message);
            }
        }
        pass = (key: string): void => {
            this.ngModelController.$setValidity(key, true);
        }
    }
}