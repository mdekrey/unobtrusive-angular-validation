module ResponsivePath.Validation.Unobtrusive {

    class ValidatedFormDirective {
        restrict: string = 'E';
        private validation: ValidationService;

        constructor(validation: ValidationService) {
            this.validation = validation;
        }

        link = (scope: ng.IScope): void => {
            // Add the $$validation object at the form level so that we don't end up adding it
            // at an inner level, such as an ng-if.
            this.validation.ensureValidation(scope);
        }

        static Factory: ng.IDirectiveFactory = (() => {
            var result = (validation: ValidationService) => {
                return new ValidatedFormDirective(validation);
            };

            result.$inject = ['validation'];

            return result;
        })();
    }

    mod.directive('form', ValidatedFormDirective.Factory);
}