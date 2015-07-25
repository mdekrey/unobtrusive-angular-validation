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
            
            var copyValidation = () => {
                ngModelController.activeErrors = angular.copy(ngModelController.$error);
                this.validation.copyValidation(form);
            }
            ngModelController.activeErrors = {};

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
                scope.$watch(() => ngModelController.$modelValue, () => {
                    if (this.validation.getValidationTiming() === ValidationTiming.Realtime) {
                        copyValidation();
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
            element.on('$destroy',() => {
                delete this.validation.clearModelName(form, validationFor);

                for (var key in watches)
                    watches[key]();
            });

            element.on('blur', () => {
                copyValidation();
                scope.$digest();
            });
        }
    }

    mod.directive('val', constructorAsInjectable(ValDirective));
}