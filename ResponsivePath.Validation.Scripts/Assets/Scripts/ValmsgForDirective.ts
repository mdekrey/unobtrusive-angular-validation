module ResponsivePath.Validation.Unobtrusive {

    interface ValForScope extends ng.IScope {
        messages: ITrustedHtmlByValidationKey;
        valmsgFor: string;
    }

    class ValmsgForDirective {
        restrict: string = 'A';
        require = '^form';
        scope: any = {
            valmsgFor: '@'
        };
        templateUrl: string = 'templates/angular-unobtrusive-validation/valmsgFor.html';
        transclude: boolean = true;

        private static $inject = ['validation'];
        constructor(private validation: ValidationService) {
        }

        link = (scope: ValForScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controller: IValidatedFormController): void => {
            var modelController = <IValidatedModelController>controller[scope.valmsgFor];
            // Here we don't need to dispose our watch because we have an isolated scope that goes away when the element does.
            scope.$parent.$watchCollection(() => {
                return modelController.$invalid && this.validation.messageArray(controller, scope.valmsgFor)
            }, (newValue) => {
                if (!newValue) {
                    element.addClass('field-validation-valid');
                    element.removeClass('field-validation-error');
                    return;
                }

                var result: ITrustedHtmlByValidationKey = {};
                angular.forEach(modelController.$error, (value: boolean, key: string) => {
                    if (value && newValue[key]) {
                        result[key] = newValue[key];
                    }
                });

                scope.messages = result;

                if (newValue && !Object.keys(newValue).length) {
                    element.addClass('field-validation-valid');
                    element.removeClass('field-validation-error');
                }
                else {
                    element.removeClass('field-validation-valid');
                    element.addClass('field-validation-error');
                }
            });
        }
        
    }

    mod.directive('valmsgFor', constructorAsInjectable(ValmsgForDirective));
} 