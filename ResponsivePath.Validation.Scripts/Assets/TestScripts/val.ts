﻿module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val', function () {
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

		it('registers validation',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var element = compile('<input type="text" data-val="true" data-val-required="You must provide a first name" name="FirstName" ng-model="firstname" />')(scope);
			scope.firstname = null;
			scope.$digest();

            expect(sce.getTrustedHtml(valScope.messages['FirstName']['required'])).to.equal('You must provide a first name');
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.equal(true);
		}));

		it('don\'t fail for value attribute',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var element = compile('<input type="text" data-val="true" data-val-required="You must provide a first name" name="FirstName" ng-model="firstname" value="Matt" />')(scope);
			scope.firstname = null;
			scope.$digest();

			expect(sce.getTrustedHtml(valScope.messages['FirstName']['required'])).to.equal('You must provide a first name');
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.equal(true);
		}));

		it('don\'t fail for unknown attribute',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var element = compile('<input type="text" data-val="true" data-val-required="You must provide a first name" name="FirstName" ng-model="firstname" val-unknown />')(scope);
			scope.firstname = null;
			scope.$digest();

			expect(sce.getTrustedHtml(valScope.messages['FirstName']['required'])).to.equal('You must provide a first name');
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.equal(true);
		}));

		it('ignores if @val is not true',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var element = compile('<input type="text" data-val="false" data-val-required="You must provide a first name" name="FirstName" ng-model="firstname" />')(scope);
			scope.firstname = null;
			scope.$digest();

            expect(sce.getTrustedHtml(valScope.messages['FirstName']['required'])).to.equal('You must provide a first name');
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.equal(false);
		}));

		it('ignores if @val-if becomes false',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var element = compile('<input type="text" data-val="true" data-val-if="validate" data-val-required="You must provide a first name" name="FirstName" ng-model="firstname" />')(scope);
			scope.validate = true;
			scope.firstname = null;
			scope.$digest();

			expect(sce.getTrustedHtml(valScope.messages['FirstName']['required'])).to.equal('You must provide a first name');
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.equal(true);

			scope.validate = false;
			scope.$digest();
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.equal(false);
		}));

		it('destroys',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var element = compile('<input type="text" data-val="true" data-val-required="You must provide a first name" name="FirstName" ng-model="firstname" />')(scope);
			scope.firstname = null;
			scope.$digest();

			element.remove();
			expect(valScope.messages).not.to.have.key('FirstName');
		}));

	});
}