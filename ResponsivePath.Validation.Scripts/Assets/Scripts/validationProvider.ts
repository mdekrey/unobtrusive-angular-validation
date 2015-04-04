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

        constructor() {
            this.$get.$inject = ['$injector'];
        }

        static Factory: ng.IServiceProviderFactory = () => {
            return new ValidationProvider();
        }
    }

    mod.provider('validation', ValidationProvider.Factory);
}