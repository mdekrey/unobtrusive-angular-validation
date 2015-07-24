module ResponsivePath.Validation.Unobtrusive {

    interface ValidationTypeCollection {
        [index: string]: ValidationType;
    }
    
    export class ValidationProvider implements ng.IServiceProvider {
        private validationTypes: ValidationTypeCollection = {};

        getValidationType(validatorName: string): ValidationType {
            return this.validationTypes[validatorName];
        }

        addValidator(validatorName: string, validate: ValidateMethod, inject?: string[]) {
            this.validationTypes[validatorName] = { validate: validate, inject: inject || [] };
        }

        $get($injector: ng.auto.IInjectorService): ValidationService {
            return $injector.instantiate(ValidationService, { 'getValidationType': (validatorName: string) => this.getValidationType(validatorName) });
        }

        private static $inject: string[] = [];
        constructor() {
            this.$get.$inject = ['$injector'];
        }
        
    }

    mod.provider('validation', constructorAsInjectable(ValidationProvider));
}