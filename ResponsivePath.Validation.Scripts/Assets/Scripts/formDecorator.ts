module ResponsivePath.Validation.Unobtrusive {

    interface IFormErrors { [errorType: string]: IValidatedModelController[] }


    class FormDirective {
        restrict: string = 'E';
        require = 'form';

        private static $inject = ['validation'];
        constructor(private validation: ValidationService) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, form: IValidatedFormController): void => {
            form.$$validationState = {
                blurErrors: null,
                submittedErrors: null,
                activeErrors: {},
                activeErrorsByModel: {},
                blurred: () => {
                    form.$$validationState.blurErrors = FormDirective.copyErrors(form.$error);
                },
                submitted: () => {
                    angular.forEach(ValidationService.getModelNames(form), (modelName) => {
                        (<IValidatedModelController>form[modelName]).submittedErrors = angular.copy((<IValidatedModelController>form[modelName]).$error);
                    });

                    form.$$validationState.submittedErrors = FormDirective.copyErrors(form.$error);
                }
            };

            this.validation.getValidationTiming().registerForm(scope, element, form);
        };

        private static copyErrors(errors: IFormErrors): IFormErrors {
            var result: IFormErrors = {};
            angular.forEach(errors, (val, key) => {
                result[key] = val.slice(0);
            });
            return result;
        }
    }

    modBase.directive('form', constructorAsInjectable(FormDirective));
}