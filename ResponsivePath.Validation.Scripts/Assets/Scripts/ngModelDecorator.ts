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
            ngModelController.blurErrors = {};
            ngModelController.submittedErrors = {};
            
            var watches = [
                scope.$watchCollection(() => ngModelController.activeErrors, (newActiveErrors: any) => {
                    if (newActiveErrors && Object.keys(newActiveErrors).length) {
                        element.addClass(this.validation.getDelayedInvalidClass());
                        element.removeClass(this.validation.getDelayedValidClass());
                    }
                    else {
                        element.removeClass(this.validation.getDelayedInvalidClass());
                        element.addClass(this.validation.getDelayedValidClass());
                    }
                }),
            ];

            this.validation.getValidationTiming().registerModel(scope, element, ngModelController, form);
            
            var validationFor = attrs['name'];
            
            // Make sure we dispose all our 
            element.on('$destroy', () => {
                // a removed element shouldn't continue to be invalid
                _.each(ngModelController.$error, (val, key) => {
                    ngModelController.$setValidity(key, true);
                });

                for (var key in watches)
                    watches[key]();
            });

            element.on('blur', () => {
                ngModelController.blurErrors = angular.copy(ngModelController.$error);
                if (form) {
                    form.$$validationState.blurred();
                }
                scope.$digest();
            });
        }
    }

    mod.directive('ngModel', constructorAsInjectable(NgModelDirective));
}