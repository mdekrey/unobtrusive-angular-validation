module ResponsivePath.Validation.Unobtrusive {

    class ValDirective {
        restrict: string = 'A';
        require: string = 'ngModel';
		
        private static $inject = ['validation', '$parse'];
        constructor(private validation: ValidationService, private parse: ng.IParseService) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModelController: IValidatedModelController): void => {
            var isEnabledParse = this.parse(attrs['val']);
            var isEnabled = isEnabledParse(scope);
            var additionalIfEnabled = true;

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
                })
            ];

            if (attrs['valIf']) {
                var additionalIfEnabledParse = this.parse(attrs['valIf']);
                watches.push(scope.$watch(() => additionalIfEnabledParse(scope), (newValue) => {
                    additionalIfEnabled = newValue;
                    updateEnabled();
                }));
            }

            var validationFor = attrs['name'];
            
            var validators = this.validation.buildValidation(scope, element, attrs, ngModelController);

            ngModelController.$parsers.unshift(validators.runValidations);
            ngModelController.$formatters.unshift(validators.runValidations);

            // Make sure we dispose all our 
            element.on('$destroy',() => {
                delete this.validation.clearModelName(scope, validationFor);

                for (var key in watches)
                    watches[key]();
            });
        }
    }

    mod.directive('val', constructorAsInjectable(ValDirective));
}