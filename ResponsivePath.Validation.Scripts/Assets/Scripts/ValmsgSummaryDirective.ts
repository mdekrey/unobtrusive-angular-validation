module ResponsivePath.Validation.Unobtrusive {

    interface SummaryScope extends ng.IScope {
        started: boolean;
        validationSummary: any[]; // TODO - what type is this?
    }

    class ValmsgSummaryDirective {
        restrict: string = 'A';
        scope: any = {};
        templateUrl: string = 'templates/angular-unobtrusive-validation/valmsgSummary.html';
        transclude: boolean = true;
        private validation: ValidationService;

        constructor(validation: ValidationService) {
            this.validation = validation;
        }

        link = (scope: SummaryScope, element: ng.IAugmentedJQuery): void => {
            scope.started = false;
            scope.validationSummary = [];
			var parentScope = scope.$parent;
			var update = () => {
                if (!this.validation.showValidationSummary) return;
                var merged: any[] = [];
                // flatten the nested arrays into "merged"
                var obj = this.validation.messageArray(parentScope);
                (<ng.IAngularStatic>angular).forEach(obj,(value, key) => {
                    if (obj.hasOwnProperty(key)) {
                        scope.started = true;
                        (<ng.IAngularStatic>angular).forEach(value,(innerValue) => {
                            if (innerValue && merged.indexOf(innerValue) == -1) {
                                merged.push(innerValue);
                            }
                        });
                    }
                });
                scope.validationSummary = merged;
                if (scope.started) {
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
				parentScope.$watchCollection(this.validation.messageArray, update),
				parentScope.$watch(() => this.validation.showValidationSummary, update)
			];

            element.on('$destroy',() => angular.forEach(watches, (watch) => watch()));
        }

        static Factory: ng.IDirectiveFactory = (() => {
            var result = (validation: ValidationService) => {
                return new ValmsgSummaryDirective(validation);
            };

            result.$inject = ['validation'];

            return result;
        })();
    }

    mod.directive('valmsgSummary', ValmsgSummaryDirective.Factory);
}