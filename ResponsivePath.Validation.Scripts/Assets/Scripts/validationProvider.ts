module ResponsivePath.Validation.Unobtrusive {

    interface ValidationTypeCollection {
        [index: string]: ValidationType;
    }

    var validationTypes: ValidationTypeCollection = {};
    export class ValidationProvider implements ng.IServiceProvider {
        getValidationType(validatorName: string): ValidationType {
            return validationTypes[validatorName];
        }

        addValidator(validatorName: string, validate: ValidateMethod, inject?: string[]) {
            validationTypes[validatorName] = { validate: validate, inject: inject || [] };
        }

        $get($injector: ng.auto.IInjectorService): ValidationService {
            return $injector.instantiate(ValidationService, { 'getValidationType': this.getValidationType });
        }

        private static $inject: string[] = [];
        constructor() {
            this.$get.$inject = ['$injector'];
        }
        
    }

    mod.provider('validation', constructorAsInjectable(ValidationProvider));
}