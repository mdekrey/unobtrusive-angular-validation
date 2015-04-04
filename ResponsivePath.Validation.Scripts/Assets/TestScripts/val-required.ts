module ResponsivePath.Validation.Unobtrusive.Tests {
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

		it('fails a null value',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var element = compile('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />')(scope);
			valScope.cancelSuppress = true;
			scope.firstname = null;
			scope.$digest();

			expect(sce.getTrustedHtml(valScope.messages['Personal.FirstName']['required'])).to.equal('You must provide a first name');
		}));

		it('fails an empty value',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var element = compile('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />')(scope);
			valScope.cancelSuppress = true;
			scope.firstname = '';
			scope.$digest();

			expect(sce.getTrustedHtml(valScope.messages['Personal.FirstName']['required'])).to.equal('You must provide a first name');
		}));

		it('fails an false value',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var element = compile('<input type="checkbox" data-val="true" data-val-required="You must agree to the terms of service" name="AgreeToTerms" ng-model="agreeToTerms" />')(scope);
			valScope.cancelSuppress = true;
			scope.agreeToTerms = false;
			scope.$digest();

			expect(sce.getTrustedHtml(valScope.messages['AgreeToTerms']['required'])).to.equal('You must agree to the terms of service');
		}));

		it('passes a non-empty value',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var element = compile('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />')(scope);
			valScope.cancelSuppress = true;
			scope.firstname = 'Matt';
			scope.$digest();

			expect(valScope.messages['Personal.FirstName']).not.to.have.key('required');
		}));

		it('passes a true value',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var element = compile('<input type="checkbox" data-val="true" data-val-required="You must agree to the terms of service" name="AgreeToTerms" ng-model="agreeToTerms" />')(scope);
			valScope.cancelSuppress = true;
			scope.agreeToTerms = true;
			scope.$digest();

			expect(valScope.messages['AgreeToTerms']).not.to.have.key('required');
		}));
		
	});
}