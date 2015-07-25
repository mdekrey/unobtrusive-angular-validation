module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val-bind-messages', function () {
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

		it('overrides validation',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();
			var valScope = validation.ensureValidation(scope);

			var element = compile('<div val-bind-messages="validationMessages" />')(scope);
			//valScope.cancelSuppress = true;
			scope.validationMessages = [
				{ memberName: 'FirstName', text: 'You must provide a first name' },
				{ memberName: 'Username', text: 'Username already in use' },
				{ memberName: 'Username', text: 'Username must be at least 6 characters.' }
			];
			scope.$digest();

			expect(_.map(valScope.messages['FirstName'],(err) => sce.getTrustedHtml(err))).to.contain('You must provide a first name');
			expect(_.map(valScope.messages['Username'],(err) => sce.getTrustedHtml(err))).to.contain('Username already in use');
			expect(_.map(valScope.messages['Username'],(err) => sce.getTrustedHtml(err))).to.contain('Username must be at least 6 characters.');

			element.remove();
		}));

	});
}