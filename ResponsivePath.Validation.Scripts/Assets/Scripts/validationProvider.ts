module ResponsivePath.Validation.Unobtrusive {

    interface ValidationTypeCollection {
        [index: string]: ValidationType;
    }

    export enum ValidationTiming {
        // Show validation, such as validation summaries, in real-time as the user types
        Realtime,
        // Update validation when the user blurs a field
        OnBlur,
        // Update validation only when the user attempts to submit the form
        OnSubmit,
    }
    
    export class ValidationProvider implements ng.IServiceProvider {
        private validationTypes: ValidationTypeCollection = {};
        private timing: ValidationTiming = ValidationTiming.Realtime;
        private shouldSetFormSubmitted: boolean = true;
        private delayedValidClass: string = 'ng-delayed-valid';
        private delayedInvalidClass: string = 'ng-delayed-invalid';

        getValidationType(validatorName: string): ValidationType {
            return this.validationTypes[validatorName];
        }

        addValidator(validatorName: string, validate: ValidateMethod, inject?: string[]) {
            this.validationTypes[validatorName] = { validate: validate, inject: inject || [] };
        }

        $get($injector: ng.auto.IInjectorService): ValidationService {
            return $injector.instantiate(ValidationService, {
                'getValidationType': (validatorName: string) => this.getValidationType(validatorName),
                'validationMessagingTiming': this.timing,
                'shouldSetFormSubmitted': this.shouldSetFormSubmitted,
                'delayedValidClass': this.delayedValidClass,
                'delayedInvalidClass': this.delayedInvalidClass,
            });
        }

        private static $inject: string[] = [];
        constructor() {
            this.$get.$inject = ['$injector'];
        }
        
        setValidationMessagingTiming(timing: ValidationTiming) {
            this.timing = timing;
        }

        setShouldSetFormSubmitted(shouldSetFormSubmitted: boolean) {
            this.shouldSetFormSubmitted = shouldSetFormSubmitted;
        }

        setValidityClasses(delayedValidClass: string, delayedInvalidClass: string) {
            this.delayedValidClass = delayedValidClass;
            this.delayedInvalidClass = delayedInvalidClass;
        }
    }

    mod.provider('validation', constructorAsInjectable(ValidationProvider));
}