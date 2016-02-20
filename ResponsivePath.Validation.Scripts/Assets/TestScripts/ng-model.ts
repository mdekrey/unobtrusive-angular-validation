module ResponsivePath.Validation.Unobtrusive.Tests {
    describe('Unit: Directive ng-model', function () {

        var scope: ng.IScope
        var form: ng.IAugmentedJQuery;
        var element: ng.IAugmentedJQuery;
        var valSubmit: ng.IAugmentedJQuery;
        var modelController: IValidatedModelController;

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
        };

        describe('when configured for custom error classes', () => {
            beforeEach(module('unobtrusive.validation', 'ngMock', (validationProvider: ResponsivePath.Validation.Unobtrusive.ValidationProvider) => {
                validationProvider.setValidityClasses('custom-valid', 'custom-invalid');
            }));

            beforeEach(inject(build));
            
            it('adds the configured error class', () => {
                modelController.activeErrors['err'] = true;
                scope.$digest();

                expect(element.hasClass('custom-invalid')).to.be(true);
                expect(element.hasClass('custom-valid')).to.be(false);
            });

            it('adds the configured valid class', () => {
                expect(element.hasClass('custom-invalid')).to.be(false);
                expect(element.hasClass('custom-valid')).to.be(true);
            });
        });

        describe('when not configured', () => {
            beforeEach(module('unobtrusive.validation', 'ngMock'));

            beforeEach(inject(build));

            it('adds the default error class', () => {
                modelController.$setValidity('err', false);
                scope.$digest();

                expect(element.hasClass('ng-delayed-invalid')).to.be(true);
                expect(element.hasClass('ng-delayed-valid')).to.be(false);
            });

            it('adds the configured valid class', () => {
                expect(element.hasClass('ng-delayed-invalid')).to.be(false);
                expect(element.hasClass('ng-delayed-valid')).to.be(true);
            });

            it('copies errors at blur', inject((validation: ValidationService) => {
                modelController.$setValidity('err', false);
                expect(modelController.blurErrors['err']).to.be(undefined);

                element.triggerHandler('blur');
                expect(modelController.blurErrors['err']).to.be(true);
            }));
        });


        describe('when configured for Realtime', () => {
            beforeEach(module('unobtrusive.validation', 'ngMock', (validationProvider: ResponsivePath.Validation.Unobtrusive.ValidationProvider) => {
                validationProvider.setValidationMessagingTiming(ValidationTiming.Realtime);
            }));
            
            beforeEach(inject(build));

            it('uses the same validation objects', () => {
                expect(modelController.activeErrors).to.be(modelController.$error);
                expect((<IValidatedFormController>form.controller('form')).$$validationState.activeErrors).to.be((<IValidatedFormController>form.controller('form')).$error);
            });
        });

        describe('when configured for OnBlur', () => {
            beforeEach(module('unobtrusive.validation', 'ngMock', (validationProvider: ResponsivePath.Validation.Unobtrusive.ValidationProvider) => {
                validationProvider.setValidationMessagingTiming(ValidationTiming.OnBlur);
            }));

            beforeEach(inject(build));

            it('copies errors at blur', inject((validation: ValidationService) => {
                modelController.$setValidity('err', false);
                expect(modelController.activeErrors['err']).to.be(undefined);

                element.triggerHandler('blur');
                expect(modelController.activeErrors['err']).to.be(true);
            }));
        });

        describe('when configured for OnSubmit', () => {
            beforeEach(module('unobtrusive.validation', 'ngMock', (validationProvider: ResponsivePath.Validation.Unobtrusive.ValidationProvider) => {
                validationProvider.setValidationMessagingTiming(ValidationTiming.OnSubmit);
            }));

            beforeEach(inject(build));

            it('does not handle copying of errors', () => {
                modelController.$setValidity('err', false);
                expect(modelController.activeErrors['err']).to.be(undefined);

                element.triggerHandler('blur');
                expect(modelController.activeErrors['err']).to.be(undefined);
            });
        });

        describe('when configured for DotNet', () => {
            beforeEach(module('unobtrusive.validation', 'ngMock', (validationProvider: ResponsivePath.Validation.Unobtrusive.ValidationProvider) => {
                validationProvider.setValidationMessagingTiming(ValidationTiming.DotNet);
            }));

            beforeEach(inject(build));

            it('copies errors at blur', inject((validation: ValidationService) => {
                modelController.$setValidity('err', false);
                expect(modelController.activeErrors['err']).to.be(undefined);

                element.triggerHandler('blur');
                expect(modelController.activeErrors['err']).to.be(true);
            }));
        });
    });
}