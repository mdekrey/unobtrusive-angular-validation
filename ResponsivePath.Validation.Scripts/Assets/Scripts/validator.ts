module ResponsivePath.Validation.Unobtrusive {
    export interface ValidationParameters {
        [key: string]: string;
    }
    export interface InjectedValidationValues {
        [key: string]: any;
    }

    export class Validator {

        constructor(
            public name: string,
            validate: ValidationType,
            public attributes: ng.IAttributes,
            public formController: IValidatedFormController,
            public ngModel: IValidatedModelController,
            protected validationTools: ValidationTools,
            $injector: ng.auto.IInjectorService) {
            this.validate = validate.validate;

            if (validate.inject) {
                (<ng.IAngularStatic>angular).forEach(validate.inject,(name) => {
                    this.injected[name] = $injector.get(name);
                });
            }
        }

        validate: ValidateMethod;
        parameters: ValidationParameters = {};
        injected: InjectedValidationValues = {};
        fail(message?: string): void {
            // TODO - handle the custom message
            this.validationTools.fail(this.name);
        }
        pass() {
            this.validationTools.pass(this.name);
        }
    }
}