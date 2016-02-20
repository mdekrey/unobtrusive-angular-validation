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
            
            ngModelController.overrideValidationMessages = {};
            
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
            ];

            if (attrs['valIf']) {
                var additionalIfEnabledParse = this.parse(attrs['valIf']);
                watches.push(scope.$watch(() => additionalIfEnabledParse(scope), (newValue) => {
                    additionalIfEnabled = newValue;
                    updateEnabled();
                }));
            }

            var validators = this.validation.buildValidation(form, element, attrs, ngModelController);

            angular.forEach(validators.actualValidators, (value: (...args: any[]) => boolean, key: string) => {
                ngModelController.$validators[key] = value;
            });

            // Make sure we dispose all our 
            element.on('$destroy', () => {
                for (var key in watches)
                    watches[key]();
            });
        }
    }

    modBase.directive('val', constructorAsInjectable(ValDirective));
}