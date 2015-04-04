module ResponsivePath.Validation.Unobtrusive {

    interface ErrorAttributes extends ng.IAttributes {
    }

    class ValErrorDirective {
        restrict: string = 'A';
        private validation: ValidationService;

        constructor(validation: ValidationService) {
            this.validation = validation;
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ErrorAttributes): void => {
            var disposeWatch = scope.$watchCollection(() => this.validation.messageArray(scope, attrs['valError']),(newValue) => {
                if (newValue && Object.keys(newValue).length) {
                    element.addClass('error');
                }
                else {
                    element.removeClass('error');
                }
            });

            element.on('$destroy',() => disposeWatch());
        }

        static Factory: ng.IDirectiveFactory = (() => {
            var result = (validation: ValidationService) => {
                return new ValErrorDirective(validation);
            };

            result.$inject = ['validation'];

            return result;
        })();
    }

    mod.directive('valError', ValErrorDirective.Factory);
}