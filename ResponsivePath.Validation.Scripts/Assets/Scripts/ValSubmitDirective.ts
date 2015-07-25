module ResponsivePath.Validation.Unobtrusive {

    class ValSubmitDirective {
        restrict: string = 'A';
        require: string = '^?form';

        private static $inject = ['validation'];
        constructor(private validation: ValidationService) {
            this.validation = validation;
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ctrl: ng.IFormController): void => {
            element.on('click', ($event) => {
                scope.$digest();
                if (ctrl.$invalid) {
                    $event.preventDefault();
                    // TODO - flag form as submitted as a configuration?
                    ctrl.$setSubmitted();
                }
            });

            var watches = [
                scope.$watch<boolean>(() => ctrl && ctrl.$invalid, (newValue: boolean) => {
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
    }

    mod.directive('valSubmit', constructorAsInjectable(ValSubmitDirective));
}