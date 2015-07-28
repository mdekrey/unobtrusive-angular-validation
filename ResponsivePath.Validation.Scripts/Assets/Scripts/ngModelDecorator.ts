module ResponsivePath.Validation.Unobtrusive {

    class NgModelDirective {
        restrict: string = 'A';
        require = ['ngModel', '^?form'];

        private static $inject = ['validation'];
        constructor(private validation: ValidationService) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controllers: any[]): void => {
            var ngModelController: IValidatedModelController = controllers[0];
            var form: IValidatedFormController = controllers[1];
            ngModelController.activeErrors = {};
            
            if (this.validation.getValidationTiming() === ValidationTiming.Realtime) {
                ngModelController.activeErrors = ngModelController.$error;
                if (form) {
                    this.validation.ensureValidation(form).activeErrors = form.$error;
                }
            }
            
            var watches = [
                scope.$watchCollection(() => ngModelController.activeErrors, (newActiveErrors: any) => {
                    if (Object.keys(newActiveErrors).length) {
                        element.addClass(this.validation.getDelayedInvalidClass());
                        element.removeClass(this.validation.getDelayedValidClass());
                    }
                    else {
                        element.removeClass(this.validation.getDelayedInvalidClass());
                        element.addClass(this.validation.getDelayedValidClass());
                    }
                }),
            ];
            
            var validationFor = attrs['name'];
            
            // Make sure we dispose all our 
            element.on('$destroy', () => {
                if (form) {
                    this.validation.clearModelName(form, validationFor);
                }

                for (var key in watches)
                    watches[key]();
            });

            if (this.validation.getValidationTiming() === ValidationTiming.OnBlur) {
                element.on('blur', () => {
                    ngModelController.activeErrors = angular.copy(ngModelController.$error);
                    if (form) {
                        this.validation.copyValidation(form);
                    }
                    scope.$digest();
                });
            }
        }
    }

    mod.directive('ngModel', constructorAsInjectable(NgModelDirective));
}