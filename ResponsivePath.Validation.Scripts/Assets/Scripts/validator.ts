module ResponsivePath.Validation.Unobtrusive {
    export interface ValidationParameters {
        [key: string]: string;
    }
    export interface InjectedValidationValues {
        [key: string]: any;
    }

    export class Validator {
        protected validationTools: ValidationTools;

        constructor(
            keyName: string,
            validate: ValidationType,
            message: any,
            attributes: ng.IAttributes,
            scope: ng.IScope,
            ngModel: IValidatedModelController,
            validationTools: ValidationTools,
            $injector: ng.auto.IInjectorService) {
            this.name = keyName;
            this.validate = validate.validate;
            this.message = message;
            this.attributes = attributes;
            this.scope = scope;
            this.ngModel = ngModel;
            this.validationTools = validationTools;

            if (validate.inject) {
                (<ng.IAngularStatic>angular).forEach(validate.inject,(name) => {
                    this.injected[name] = $injector.get(name);
                });
            }
        }

        name: string;
        validate: ValidateMethod;
        // trust as HTML returns any, so we need to use it, too
        message: any;
        parameters: ValidationParameters = {};
        injected: InjectedValidationValues = {};
        attributes: ng.IAttributes;
        scope: ng.IScope;
        ngModel: IValidatedModelController;
        fail(message?: string): void {
            this.validationTools.fail(this.name, message);
        }
        pass() {
            this.validationTools.pass(this.name);
        }
    }
}