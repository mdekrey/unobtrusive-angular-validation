module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val-range', function () {
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

			element = compile('<input type="text" data-val="true" name="Target" ng-model="target" data-val-range="Invalid" data-val-range-min="4.2" data-val-range-max="8.7" />')(scope);
			valScope.cancelSuppress = true;
		});

		function isValid() {
			expect(valScope.messages[fieldName]).not.to.have.key('range');
		}

		function isInvalid() {
			expect(sce.getTrustedHtml(valScope.messages[fieldName]['range'])).to.equal(message);
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

		var failed = ["4.1", "a", "seven", "9", 3, 12];
		_.each(failed,(badValue) => {
			it('fails "' + badValue + '"',() => {
				scope.target = badValue;
				scope.$digest();

				isInvalid();
			});
		});

		var passes = ["4.57", "6", 7, 8, 8.5];
		_.each(passes,(goodValue) => {
			it('passes "' + goodValue + '"',() => {
				scope.target = goodValue;
				scope.$digest();

				isValid();
			});
		});

	});
}