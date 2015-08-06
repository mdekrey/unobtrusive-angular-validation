module ResponsivePath.Validation.Unobtrusive {

    interface ValidationTypeCollection {
        [index: string]: ValidationType;
    }

    export interface IValidationTiming {
        registerForm(scope: ng.IScope, element: ng.IAugmentedJQuery, form: IValidatedFormController);
        registerModel(scope: ng.IScope, element: ng.IAugmentedJQuery, model: IValidatedModelController, form?: IValidatedFormController);
    }
    
    export module ValidationTiming {
        // Show validation, such as validation summaries, in real-time as the user types
        export var Realtime: IValidationTiming = {
            registerForm(scope: ng.IScope, element: ng.IAugmentedJQuery, form: IValidatedFormController) {
                form.$$validationState.activeErrors = form.$error;
            },

            registerModel(scope: ng.IScope, element: ng.IAugmentedJQuery, model: IValidatedModelController, form?: IValidatedFormController) {
                model.activeErrors = model.$error;
            }
        };

        // Update validation when the user blurs a field
        export var OnBlur: IValidationTiming = {
            registerForm(scope: ng.IScope, element: ng.IAugmentedJQuery, form: IValidatedFormController) {
                var watch = scope.$watch(() => form.$$validationState.blurErrors, () => form.$$validationState.activeErrors = form.$$validationState.blurErrors, true);
                element.on('$destroy', () => watch());
            },

            registerModel(scope: ng.IScope, element: ng.IAugmentedJQuery, model: IValidatedModelController, form?: IValidatedFormController) {
                var watch = scope.$watch(() => model.blurErrors, () => model.activeErrors = model.blurErrors, true);
                element.on('$destroy', () => watch());
            }
        };

        // Update validation only when the user attempts to submit the form
        export var OnSubmit: IValidationTiming = {
            registerForm(scope: ng.IScope, element: ng.IAugmentedJQuery, form: IValidatedFormController) {
                var watch = scope.$watch(() => form.$$validationState.submittedErrors, () => form.$$validationState.activeErrors = form.$$validationState.submittedErrors, true);
                element.on('$destroy', () => watch());
            },

            registerModel(scope: ng.IScope, element: ng.IAugmentedJQuery, model: IValidatedModelController, form?: IValidatedFormController) {
                var watch = scope.$watch(() => model.submittedErrors, () => model.activeErrors = model.submittedErrors, true);
                element.on('$destroy', () => watch());
            }
        };


        // Update validation of models on blur, but form only on submit
        export var DotNet: IValidationTiming = {
            registerForm(scope: ng.IScope, element: ng.IAugmentedJQuery, form: IValidatedFormController) {
                var watch = scope.$watch(() => form.$$validationState.submittedErrors, () => form.$$validationState.activeErrors = form.$$validationState.submittedErrors, true);
                element.on('$destroy', () => watch());
            },

            registerModel(scope: ng.IScope, element: ng.IAugmentedJQuery, model: IValidatedModelController, form?: IValidatedFormController) {
                var watch = scope.$watch(() => model.blurErrors, () => model.activeErrors = model.blurErrors, true);
                element.on('$destroy', () => watch());
            }
        };

    }
    
    export class ValidationProvider implements ng.IServiceProvider {
        private validationTypes: ValidationTypeCollection = {};
        private timing: IValidationTiming = ValidationTiming.Realtime;
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
        
        setValidationMessagingTiming(timing: IValidationTiming) {
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