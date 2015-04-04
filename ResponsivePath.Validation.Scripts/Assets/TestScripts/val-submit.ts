﻿module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val-submit', function () {
		beforeEach(module('unobtrusive.validation', 'ngMock'));

		var compile: angular.ICompileService;
		var rootScope: angular.IRootScopeService;
		var validation: ValidationService;
		var sce: angular.ISCEService;

		beforeEach(inject(($compile: angular.ICompileService, $rootScope: angular.IRootScopeService, _validation_: ValidationService, $sce: angular.ISCEService) => {
			compile = $compile;
			rootScope = $rootScope;
			validation = _validation_;
			sce = $sce;
		}));

		it('prevents submit with errors',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var form = angular.element('<form ng-submit="submitted = true" />');
			var element = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
			form.append(element);
			var valSubmit = angular.element('<input type="submit" data-val-submit value="Submit" />');
			form.append(valSubmit);
			compile(form)(scope);

			valScope.cancelSuppress = true;
			scope.firstname = null;
			scope.$digest();
			valSubmit[0].click();

			expect(scope.submitted).not.to.be(true);
			form.remove();
		}));

		it('allows submit with no errors',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var form = angular.element('<form ng-submit="submitted = true" />');
			var element = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
			form.append(element);
			var valSubmit = angular.element('<input type="submit" data-val-submit value="Submit" />');
			form.append(valSubmit);
			compile(form)(scope);

			valScope.cancelSuppress = true;
			scope.firstname = 'Matt';
			scope.$digest();
			valSubmit[0].click();

			expect(scope.submitted).to.be(true);
			form.remove();
		}));
	});
}