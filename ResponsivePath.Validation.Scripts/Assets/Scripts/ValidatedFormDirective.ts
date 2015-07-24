module ResponsivePath.Validation.Unobtrusive {

    class ValidatedFormDirective {
        restrict: string = 'E';

        private static $inject = ['validation'];
        constructor(private validation: ValidationService) {
            this.validation = validation;
        }

        link = (scope: ng.IScope): void => {
            // Add the $$validation object at the form level so that we don't end up adding it
            // at an inner level, such as an ng-if.
            this.validation.ensureValidation(scope);
        }
    }

    mod.directive('form', constructorAsInjectable(ValidatedFormDirective));
}