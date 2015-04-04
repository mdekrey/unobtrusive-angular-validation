module ResponsivePath.Validation.Unobtrusive {

    class ValDirective {
        restrict: string = 'A';
        require: string = 'ngModel';
        private validation: ValidationService;

        constructor(validation: ValidationService) {
            this.validation = validation;
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModelController: IValidatedModelController): void => {
            if (attrs['val'] != 'true')
                return;

            var validationFor = attrs['name'];

            // If suppress is true, don't actually display any validation messages.
            var validators = this.validation.buildValidation(scope, element, attrs, ngModelController);

            ngModelController.$parsers.unshift(validators.runValidations);
            ngModelController.$formatters.unshift(validators.runValidations);

            var watches = [
                // Watch to see if the hasCancelledSuppress is set to true and, if it is, cancel our own suppression.
                scope.$watch(this.validation.hasCancelledSuppress, (newValue) => {
                    if (newValue)
                        validators.cancelSuppress();
                })
            ];

            if (attrs['valIf']) {
                // watch our "valIf" expression and, if it becomse falsy, turn off all of our validations.
                watches.push(scope.$watch(attrs['valIf'], (newValue, oldValue) => {
                    if (newValue)
                        validators.enable();
                    else
                        validators.disable();
                }));
            }
            else {
                validators.enable();
            }

            // Make sure we dispose all our 
            element.on('$destroy',() => {
                delete this.validation.clearDotNetName(scope, validationFor);

                for (var key in watches)
                    watches[key]();
            });

            // Cancel suppression of error messages for this element on blur
            element.on('blur',() => {
                validators.cancelSuppress();
                scope.$digest();
            });

            if (!attrs.hasOwnProperty('valRealtime')) {
                element.on('focus', () => {
                    validators.enableSuppress();
                });
            }
            else {
                element.on('focus', () => {
                    validators.cancelSuppress();
                    scope.$digest();
                });
            }
        }

        static Factory: ng.IDirectiveFactory = (() => {
            var result = (validation: ValidationService) => {
                return new ValDirective(validation);
            };

            result.$inject = ['validation'];

            return result;
        })();
    }
    
    mod.directive('val', ValDirective.Factory);
}