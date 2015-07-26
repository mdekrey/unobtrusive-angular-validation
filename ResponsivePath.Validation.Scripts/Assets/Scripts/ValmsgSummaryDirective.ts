module ResponsivePath.Validation.Unobtrusive {

    interface SummaryScope extends ng.IScope {
        validationSummary: ITrustedHtml[];
        submitted: boolean;
    }

    class ValmsgSummaryDirective {
        restrict: string = 'A';
        scope: any = {};
        templateUrl: string = 'templates/angular-unobtrusive-validation/valmsgSummary.html';
        transclude: boolean = true;
        require = '^form';

        private static $inject = ['validation', '$sce'];
        constructor(private validation: ValidationService, private sce: ng.ISCEService) {
        }

        link = (scope: SummaryScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, controller: IValidatedFormController): void => {
            scope.validationSummary = [];
            scope.submitted = false;
			var parentScope = scope.$parent;
            var update = () => {
                var rawHtml: string[] = [];
                var merged: ITrustedHtml[] = [];
                // flatten the nested arrays into "merged"
                var obj = this.validation.activeMessageArray(controller);
                (<ng.IAngularStatic>angular).forEach(obj,(value, key) => {
                    if (obj.hasOwnProperty(key)) {
                        (<ng.IAngularStatic>angular).forEach(value,(innerValue) => {
                            var rawValue = this.sce.getTrustedHtml(innerValue);
                            if (innerValue && rawValue && rawHtml.indexOf(rawValue) == -1) {
                                rawHtml.push(rawValue);
                                merged.push(innerValue);
                            }
                        });
                    }
                });
                scope.validationSummary = merged;
                if (scope.submitted) {
                    if (!merged.length) {
                        element.addClass('validation-summary-valid');
                        element.removeClass('validation-summary-errors');
                    }
                    else {
                        element.removeClass('validation-summary-valid');
                        element.addClass('validation-summary-errors');
                    }
                }
            };
            // Here we don't need to dispose our watch because we have an isolated scope that goes away when the element does.
            var watches = [
                scope.$watch(() => controller.$error, update, true),
                scope.$watch(() => controller.validationState.activeErrors, (newValue: any) => {
                    scope.submitted = !!newValue;
                    update();
                }),
			];

            element.on('$destroy',() => angular.forEach(watches, (watch) => watch()));
        }
    }

    mod.directive('valmsgSummary', constructorAsInjectable(ValmsgSummaryDirective));
}