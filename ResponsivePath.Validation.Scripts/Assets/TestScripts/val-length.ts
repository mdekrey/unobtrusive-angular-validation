module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val-length', function () {
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

		var scope: any;
		var valScope: ScopeValidationState;
		var fieldName: string = 'Target';
		var message: string = 'Invalid';
		var element: angular.IAugmentedJQuery;

		beforeEach(() => {
			scope = rootScope.$new();
			valScope = validation.ensureValidation(scope);

			element = compile('<input type="text" data-val="true" name="Target" ng-model="target" data-val-length="Invalid" data-val-length-min="4" data-val-length-max="8" />')(scope);
			valScope.cancelSuppress = true;
		});

		function isValid() {
			expect(valScope.messages[fieldName]).not.to.have.key('length');
		}

		function isInvalid() {
			expect(sce.getTrustedHtml(valScope.messages[fieldName]['length'])).to.equal(message);
		}

		it('passes a null value',() => {
			scope.target = null;
			scope.$digest();

			isValid();
		});

		it('passes an empty value',() => {
			scope.target = '';
			scope.$digest();

			isValid();
		});

		var failed = ["a", "(", "-1", "1", "abc", "15.000.11", "1234567890123456789012345678901234567890"];
		_.each(failed,(badValue) => {
			it('fails "' + badValue + '"',() => {
				scope.target = badValue;
				scope.$digest();

				isInvalid();
			});
		});

		var passes = ["4.57", "75137", "1,000", "words"];
		_.each(passes,(goodValue) => {
			it('passes "' + goodValue + '"',() => {
				scope.target = goodValue;
				scope.$digest();

				isValid();
			});
		});

	});
}