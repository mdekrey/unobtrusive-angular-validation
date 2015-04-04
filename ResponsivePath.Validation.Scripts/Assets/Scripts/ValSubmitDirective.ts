module ResponsivePath.Validation.Unobtrusive {

    class ValSubmitDirective {
        restrict: string = 'A';
        require: string = '^?form';
        private validation: ValidationService;

        constructor(validation: ValidationService) {
            this.validation = validation;
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: ng.IFormController): void => {
            element.on('click', ($event) => {
                if (ctrl.$invalid) {
                    $event.preventDefault();
                    this.validation.showValidationSummary = true;
                    // Cancels the suppression of validation messages, which reveals error classes, validation summaries, etc.
                    this.validation.cancelSuppress(scope);
                    scope.$digest();
                }
            });

            var watches = [
                scope.$watch<boolean>(() => ctrl.$invalid, (newValue: boolean) => {
                    if (newValue)
                        element.addClass('disabled');
                    else
                        element.removeClass('disabled');
                })
            ];

            element.on('$destroy', () => {
                for (var key in watches)
                    watches[key]();
            });
        }

        static Factory: ng.IDirectiveFactory = (() => {
            var result = (validation: ValidationService) => {
                return new ValSubmitDirective(validation);
            };

            result.$inject = ['validation'];

            return result;
        })();
    }

    mod.directive('valSubmit', ValSubmitDirective.Factory);
}