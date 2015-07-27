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
        private validators: ValidatorCollection;

        constructor(
            private attrs: ng.IAttributes,
            private ngModelController: IValidatedModelController,
            private svc: ValidationService,
            private formController: IValidatedFormController,
            private $injector: ng.auto.IInjectorService,
            private $sce: IMySCEService,
            private getValidationType: (keyName: string) => ValidationType) {

            this.validationFor = attrs['name'];

            ngModelController.allValidationMessages = {};
            ngModelController.overrideValidationMessages = {};

            this.validators = this.buildValidatorsFromAttributes();
        }

        enable(): void {
            this.validationEnabled = true;
            this.runValidations((<IValidatedModelController>this.formController[this.validationFor]).$modelValue);
        }
        disable(): void {
            this.validationEnabled = false;
            (<ng.IAngularStatic>angular).forEach(this.validators, (value, key) => {
                this.pass(key);
            })
        }
        runValidations = (newValue: any) => {
            if (this.validationEnabled) {
                // Run validations for all of our client-side validation and store in a local array.
                (<ng.IAngularStatic>angular).forEach(this.validators, (value, key) => {
                    if (!value.validate(newValue, value))
                        value.fail();
                    else
                        value.pass();
                });
            }
            return newValue;
        }
        fail = (key: string, message?: string): void => {
            if (this.validationEnabled) {
                this.ngModelController.$setValidity(key, false);
            }

            if (message) {
                this.ngModelController.overrideValidationMessages[key] = this.$sce.trustAsHtml(message);
            }
            else {
                this.ngModelController.overrideValidationMessages[key] = null;
            }
        }
        pass = (key: string): void => {
            this.ngModelController.$setValidity(key, true);
        }


        // Aggregate our attributes for validation parameters. 
        // For example, valRegexPattern is a parameter of valRegex called "pattern".
        private buildValidatorsFromAttributes(): ValidatorCollection {
            var keys: string[] = Object.keys(this.attrs).sort();
            var result: ValidatorCollection = {};
            angular.forEach(keys, (key) => {
                if (key == 'val' || key == 'valIf' || key == 'valRealtime' || !startsWith(key, 'val'))
                    return;
                var handled = false;
                if (key.substr(3).charAt(0).toLowerCase() == key.substr(3).charAt(0)) {
                    // Check to make sure the next character is an upper-case character... keeps us from capturing attributes named "value" and things like that.
                    return;
                }
                var keyName = camelCase(key.substr(3));
                angular.forEach(result, (validator, validatorName) => {
                    // go back through previous validators and add as parameters if it matches
                    if (startsWith(keyName, validatorName)) {
                        validator.parameters[camelCase(keyName.substr(validatorName.length))] = this.attrs[key];
                        handled = true;
                        return;
                    }
                });
                if (handled)
                    return;

                // wasn't a validator parameter, so add it to our list
                var validate: ValidationType = this.getValidationType(keyName);
                if (validate) {
                    this.ngModelController.allValidationMessages[keyName] = this.$sce.trustAsHtml(this.attrs[key]);
                    result[keyName] = new Validator(keyName, validate, this.attrs, this.formController, this.ngModelController, this, this.$injector);
                }
                else {
                    console.log('WARNING: Unhandled validation attribute: ' + keyName);
                }
            });
            return result;
        }
    }
}