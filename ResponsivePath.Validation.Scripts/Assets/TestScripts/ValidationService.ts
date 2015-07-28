module ResponsivePath.Validation.Unobtrusive.Tests {
    describe('Unit: ValidationService', function () {
        beforeEach(module('unobtrusive.validation', 'ngMock'));

        var validation: ValidationService;
        var scope: ng.IScope;
        var element: ng.IAugmentedJQuery;
        var formController: ng.IFormController;

        beforeEach(inject((_validation_: ValidationService, $compile: angular.ICompileService, $rootScope: angular.IRootScopeService) => {
            validation = _validation_;
            scope = $rootScope.$new();
            element = $compile('<form />')(scope);
            formController = element.controller('form');
        }));

        it('can access validation types', () => {
            var email = validation.getValidation('email');

            expect(email.validate('test@example.com', null)).to.be(true);
            expect(email.validate('test', null)).to.be(false);
        });

        describe('Validation Scoping...', () => {
            it('can get a unique validation scope', () => inject(($rootScope: angular.IRootScopeService) => {
                var validationScope = validation.ensureValidation(formController);
                var validationScope2 = validation.ensureValidation(formController);

                expect(validationScope).not.to.be(null);
                expect(validationScope).to.be(validationScope2);
            }));

            it('has separate validation in separate scopes', () => inject(($rootScope: angular.IRootScopeService, $compile: angular.ICompileService) => {
                var otherScope: ng.IScope = $rootScope.$new();
                var otherElement: ng.IAugmentedJQuery = $compile('<form />')(otherScope);
                var otherFormController: ng.IFormController = otherElement.controller('form');

                var validationScope = validation.ensureValidation(formController);
                var validationScope2 = validation.ensureValidation(otherFormController);

                expect(validationScope).not.to.be(validationScope2);
            }));
        });

        describe('Getters/setters', () => {
            var compile: angular.ICompileService;
            var rootScope: angular.IRootScopeService;
            var sce: angular.ISCEService;

            beforeEach(inject(($compile: angular.ICompileService, $rootScope: angular.IRootScopeService, $sce: angular.ISCEService) => {
                compile = $compile;
                rootScope = $rootScope;
                sce = $sce;
            }));
            
            var formController: ng.IFormController;
            var valScope: ScopeValidationState;
            var fieldName: string = 'Obj.Target';
            var message: string = 'Invalid';
            var form: angular.IAugmentedJQuery;
            var element: angular.IAugmentedJQuery;
            var matchElement: angular.IAugmentedJQuery;


            beforeEach(() => {
                form = angular.element('<form name="form"/>');
                element = angular.element('<input type="text" data-val="true" name="Obj.Target" ng-model="target" data-val-required="Invalid" />');
                matchElement = angular.element('<input type="text" data-val="true" name="Obj.Other" ng-model="other" />');
                form.append(element);
                form.append(matchElement);
                compile(form)(rootScope.$new());
                formController = form.controller('form');
                valScope = validation.ensureValidation(formController);

                formController['Obj.Other'].$setViewValue('othervalue');
                scope.$digest();
            });

            it('can get messages', () => {
                expect(sce.getTrustedHtml(validation.messageArray(formController)['Obj.Target']['required'])).to.be('Invalid');
                expect(sce.getTrustedHtml(validation.messageArray(formController, 'Obj.Target')['required'])).to.be('Invalid');
            });
        });
    });
}