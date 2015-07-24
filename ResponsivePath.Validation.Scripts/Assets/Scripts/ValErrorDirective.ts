module ResponsivePath.Validation.Unobtrusive {

    interface ErrorAttributes extends ng.IAttributes {
    }

    class ValErrorDirective {
        restrict: string = 'A';

        private static $inject = ['validation'];
        constructor(private validation: ValidationService) {
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
    }

    mod.directive('valError', constructorAsInjectable(ValErrorDirective));
}