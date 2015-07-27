module ResponsivePath.Validation.Unobtrusive {

    class ValDirective {
        restrict: string = 'A';
        require = ['ngModel', '^form'];
		
        private static $inject = ['validation', '$parse'];
        constructor(private validation: ValidationService, private parse: ng.IParseService) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controllers: any[]): void => {
            var ngModelController: IValidatedModelController = controllers[0];
            var form: IValidatedFormController = controllers[1];
            var isEnabledParse = this.parse(attrs['val']);
            var isEnabled = isEnabledParse(scope);
            var additionalIfEnabled = true;
            
            ngModelController.activeErrors = {};
            ngModelController.overrideValidationMessages = {};

            if (this.validation.getValidationTiming() === ValidationTiming.Realtime) {
                ngModelController.activeErrors = ngModelController.$error;
            }

            function updateEnabled() {
                if (isEnabled && additionalIfEnabled) {
                    validators.enable();
                }
                else {
                    validators.disable();
                }
            }
            
            var watches = [
                scope.$watch(() => isEnabledParse(scope), (newValue) => {
                    isEnabled = newValue;
                    updateEnabled();
                }),
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

            if (attrs['valIf']) {
                var additionalIfEnabledParse = this.parse(attrs['valIf']);
                watches.push(scope.$watch(() => additionalIfEnabledParse(scope), (newValue) => {
                    additionalIfEnabled = newValue;
                    updateEnabled();
                }));
            }

            var validationFor = attrs['name'];
            
            var validators = this.validation.buildValidation(form, element, attrs, ngModelController);

            ngModelController.$parsers.unshift(validators.runValidations);
            ngModelController.$formatters.unshift(validators.runValidations);

            // Make sure we dispose all our 
            element.on('$destroy', () => {
                this.validation.clearModelName(form, validationFor);

                for (var key in watches)
                    watches[key]();
            });

            if (this.validation.getValidationTiming() === ValidationTiming.OnBlur) {
                element.on('blur', () => {
                    ngModelController.activeErrors = angular.copy(ngModelController.$error);
                    this.validation.copyValidation(form);
                    scope.$digest();
                });
            }
        }
    }

    mod.directive('val', constructorAsInjectable(ValDirective));
}