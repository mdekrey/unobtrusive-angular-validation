module ResponsivePath.Validation.Unobtrusive.Tests {
    describe('Unit: Directive form', function () {

        var scope: ng.IScope
        var form: ng.IAugmentedJQuery;
        var element: ng.IAugmentedJQuery;
        var formController: IValidatedFormController;
        var modelController: IValidatedModelController;
        var valSubmit: ng.IAugmentedJQuery;

        function build($compile: angular.ICompileService, $rootScope: angular.IRootScopeService) {
            scope = $rootScope.$new();
            form = angular.element('<form ng-submit="submitted = true" />');
            element = angular.element('<input type="text" name="Personal.FirstName" ng-model="firstname" />');
            form.append(element);
            valSubmit = angular.element('<input type="submit" data-val-submit value="Submit" />');
            form.append(valSubmit);
            $compile(form)(scope);
            scope.$digest();
            modelController = element.controller('ngModel');
            formController = form.controller('form');
        };
        
        describe('when configured for Realtime', () => {
            beforeEach(module('unobtrusive.validation', 'ngMock', (validationProvider: ResponsivePath.Validation.Unobtrusive.ValidationProvider) => {
                validationProvider.setValidationMessagingTiming(ValidationTiming.Realtime);
            }));

            beforeEach(inject(build));

            it('uses the same validation objects', () => {
                expect(formController.$$validationState.activeErrors).to.be(formController.$error);
            });
        });

        describe('when configured for OnBlur', () => {
            beforeEach(module('unobtrusive.validation', 'ngMock', (validationProvider: ResponsivePath.Validation.Unobtrusive.ValidationProvider) => {
                validationProvider.setValidationMessagingTiming(ValidationTiming.OnBlur);
            }));

            beforeEach(inject(build));

            it('copies errors at blur', inject((validation: ValidationService) => {
                modelController.$setValidity('err', false);
                scope.$digest();
                expect(formController.$error['err']).to.contain(modelController);
                expect(formController.$$validationState.activeErrors).to.be(null);

                element.triggerHandler('blur');
                expect(formController.$$validationState.blurErrors['err']).to.contain(modelController);
                expect(formController.$$validationState.activeErrors['err']).to.contain(modelController);
            }));
        });

        describe('when configured for OnSubmit', () => {
            beforeEach(module('unobtrusive.validation', 'ngMock', (validationProvider: ResponsivePath.Validation.Unobtrusive.ValidationProvider) => {
                validationProvider.setValidationMessagingTiming(ValidationTiming.OnSubmit);
            }));

            beforeEach(inject(build));

            it('copies errors at submit', inject((validation: ValidationService) => {
                modelController.$setValidity('err', false);
                scope.$digest();
                expect(formController.$error['err']).to.contain(modelController);
                expect(formController.$$validationState.activeErrors).to.be(null);

                valSubmit.triggerHandler('click');
                expect(formController.$$validationState.submittedErrors['err']).to.contain(modelController);
                expect(formController.$$validationState.activeErrors['err']).to.contain(modelController);
            }));
        });

        describe('when configured for DotNet', () => {
            beforeEach(module('unobtrusive.validation', 'ngMock', (validationProvider: ResponsivePath.Validation.Unobtrusive.ValidationProvider) => {
                validationProvider.setValidationMessagingTiming(ValidationTiming.DotNet);
            }));

            beforeEach(inject(build));

            it('copies errors at submit', inject((validation: ValidationService) => {
                modelController.$setValidity('err', false);
                scope.$digest();
                expect(formController.$error['err']).to.contain(modelController);
                expect(formController.$$validationState.activeErrors).to.be(null);

                valSubmit.triggerHandler('click');
                expect(formController.$$validationState.submittedErrors['err']).to.contain(modelController);
                expect(formController.$$validationState.activeErrors['err']).to.contain(modelController);
            }));
        });

    });
}