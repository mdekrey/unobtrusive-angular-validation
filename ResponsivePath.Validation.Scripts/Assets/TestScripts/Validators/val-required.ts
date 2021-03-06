﻿module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val-required', function () {
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

        function isValid(element: ng.IAugmentedJQuery) {
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.be(false);
        }

        function isInvalid(element: ng.IAugmentedJQuery) {
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.be(true);
        }

		it('fails a null value',() => inject(($rootScope: angular.IRootScopeService) => {
            var scope: ng.IScope = $rootScope.$new();

			var element = compile('<form><input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" /></form>')(scope);
            element = element.find('input');
			scope['firstname'] = null;
			scope.$digest();

            isInvalid(element);
		}));

		it('fails an empty value',() => inject(($rootScope: angular.IRootScopeService) => {
            var scope: ng.IScope = $rootScope.$new();

			var element = compile('<form><input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" /></form>')(scope);
            element = element.find('input');
            scope['firstname'] = '';
			scope.$digest();

            isInvalid(element);
		}));

		it('fails an false value',() => inject(($rootScope: angular.IRootScopeService) => {
            var scope: ng.IScope = $rootScope.$new();

			var element = compile('<form><input type="checkbox" data-val="true" data-val-required="You must agree to the terms of service" name="AgreeToTerms" ng-model="agreeToTerms" /></form>')(scope);
            element = element.find('input');
			scope['agreeToTerms'] = false;
			scope.$digest();

            isInvalid(element);
		}));

		it('passes a non-empty value',() => inject(($rootScope: angular.IRootScopeService) => {
            var scope: ng.IScope = $rootScope.$new();

			var element = compile('<form><input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" /></form>')(scope);
            element = element.find('input');
            scope['firstname'] = 'Matt';
			scope.$digest();

            isValid(element);
		}));

		it('passes a true value',() => inject(($rootScope: angular.IRootScopeService) => {
            var scope: ng.IScope = $rootScope.$new();

			var element = compile('<form><input type="checkbox" data-val="true" data-val-required="You must agree to the terms of service" name="AgreeToTerms" ng-model="agreeToTerms" /></form>')(scope);
            element = element.find('input');
            scope['agreeToTerms'] = true;
			scope.$digest();

            isValid(element);
		}));
		
	});
}