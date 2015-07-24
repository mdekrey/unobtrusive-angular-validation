module ResponsivePath.Validation.Unobtrusive {

    interface ValForScope extends ng.IScope {
        messages: ITrustedHtmlByValidationKey;
        started: boolean;
        valmsgFor: string;
    }

    class ValmsgForDirective {
        restrict: string = 'A';
        scope: any = {
            valmsgFor: '@'
        };
        templateUrl: string = 'templates/angular-unobtrusive-validation/valmsgFor.html';
        transclude: boolean = true;

        private static $inject = ['validation'];
        constructor(private validation: ValidationService) {
        }

        link = (scope: ValForScope, element: ng.IAugmentedJQuery): void => {
            // Here we don't need to dispose our watch because we have an isolated scope that goes away when the element does.
            var watch = scope.$parent.$watchCollection(() => {
                return this.validation.messageArray(scope.$parent, scope.valmsgFor)
            }, (newValue) => {
                scope.messages = newValue;
                if (newValue !== undefined) {
                    scope.started = true;
                }

                if (scope.started) {
                    if (newValue && !Object.keys(newValue).length) {
                        element.addClass('field-validation-valid');
                        element.removeClass('field-validation-error');
                    }
                    else {
                        element.removeClass('field-validation-valid');
                        element.addClass('field-validation-error');
                    }
                }
            });

            element.on('$destroy', () => watch());
        }
        
    }

    mod.directive('valmsgFor', constructorAsInjectable(ValmsgForDirective));
} 