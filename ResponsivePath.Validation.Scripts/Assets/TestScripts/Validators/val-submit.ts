module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val-submit', function () {
		var compile: angular.ICompileService;
		var rootScope: angular.IRootScopeService;
		var validation: ValidationService;
        var sce: angular.ISCEService;

        describe('when configured to submit', () => {
            beforeEach(module('unobtrusive.validation', 'ngMock', (validationProvider: ResponsivePath.Validation.Unobtrusive.ValidationProvider) => {
                validationProvider.setValidationMessagingTiming(ValidationTiming.OnSubmit);
            }));


            beforeEach(inject(($compile: angular.ICompileService, $rootScope: angular.IRootScopeService, _validation_: ValidationService, $sce: angular.ISCEService) => {
                compile = $compile;
                rootScope = $rootScope;
                validation = _validation_;
                sce = $sce;
            }));

            it('prevents submit with errors', () => inject(($rootScope: angular.IRootScopeService) => {
                var scope: ng.IScope = $rootScope.$new();

                var form = angular.element('<form ng-submit="submitted = true" />');
                var element = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
                form.append(element);
                var valSubmit = angular.element('<input type="submit" data-val-submit value="Submit" />');
                form.append(valSubmit);
                compile(form)(scope);

                scope['firstname'] = null;
                scope.$digest();
                valSubmit[0].click();

                expect(scope['submitted']).not.to.be(true);
                form.remove();
            }));

            it('flags form controller as submitted', () => inject(($rootScope: angular.IRootScopeService) => {
                var scope: ng.IScope = $rootScope.$new();

                var form = angular.element('<form ng-submit="submitted = true" />');
                var element = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
                form.append(element);
                var valSubmit = angular.element('<input type="submit" data-val-submit value="Submit" />');
                form.append(valSubmit);
                compile(form)(scope);

                scope['firstname'] = null;
                scope.$digest();
                valSubmit[0].click();

                expect(form.controller('form').$submitted).to.be(true);
                form.remove();
            }));

            it('allows submit with no errors', () => inject(($rootScope: angular.IRootScopeService) => {
                var scope: ng.IScope = $rootScope.$new();

                var form = angular.element('<form ng-submit="submitted = true" />');
                var element = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
                form.append(element);
                var valSubmit = angular.element('<input type="submit" data-val-submit value="Submit" />');
                form.append(valSubmit);
                compile(form)(scope);

                scope['firstname'] = 'Matt';
                scope.$digest();
                valSubmit[0].click();

                expect(scope['submitted']).to.be(true);
                form.remove();
            }));

            it('copies validation on submit', inject(($rootScope: angular.IRootScopeService) => {
                var scope = $rootScope.$new();
                var form = angular.element('<form ng-submit="submitted = true" />');
                var element = angular.element('<input type="text" name="Personal.FirstName" ng-model="firstname" />');
                form.append(element);
                var valSubmit = angular.element('<input type="submit" data-val-submit value="Submit" />');
                form.append(valSubmit);
                compile(form)(scope);
                scope.$digest();

                (<IValidatedModelController>element.controller('ngModel')).$error['err'] = true;
                scope.$digest();
                expect((<IValidatedModelController>element.controller('ngModel')).activeErrors['err']).to.be(undefined);

                valSubmit[0].click();
                expect((<IValidatedModelController>element.controller('ngModel')).activeErrors['err']).to.be(true);
            }));
        });

        describe('when configured to not submit', () => {
            beforeEach(module('unobtrusive.validation', 'ngMock', (validationProvider: ResponsivePath.Validation.Unobtrusive.ValidationProvider) => {
                validationProvider.setValidationMessagingTiming(ValidationTiming.OnSubmit);
                validationProvider.setShouldSetFormSubmitted(false);
            }));

            beforeEach(inject(($compile: angular.ICompileService, $rootScope: angular.IRootScopeService, _validation_: ValidationService, $sce: angular.ISCEService) => {
                compile = $compile;
                rootScope = $rootScope;
                validation = _validation_;
                sce = $sce;
            }));


            it('flags form controller as submitted', () => inject(($rootScope: angular.IRootScopeService) => {
                var scope: ng.IScope = $rootScope.$new();

                var form = angular.element('<form ng-submit="submitted = true" />');
                var element = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
                form.append(element);
                var valSubmit = angular.element('<input type="submit" data-val-submit value="Submit" />');
                form.append(valSubmit);
                compile(form)(scope);

                scope['firstname'] = null;
                scope.$digest();
                valSubmit[0].click();

                expect(form.controller('form').$submitted).to.be(false);
                form.remove();
            }));

        });
	});
}