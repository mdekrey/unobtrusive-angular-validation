module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val-digits', function () {
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

			element = compile('<input type="text" data-val="true" name="Target" ng-model="target" data-val-digits="Invalid" />')(scope);
			valScope.cancelSuppress = true;
		});

		function isValid() {
			expect(valScope.messages[fieldName]).not.to.have.key('digits');
		}

		function isInvalid() {
			expect(sce.getTrustedHtml(valScope.messages[fieldName]['digits'])).to.equal(message);
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

		var failed = ["-1", "4.57", "a", "(", "1,000"];
		_.each(failed,(badValue) => {
			it('fails "' + badValue+'"',() => {
				scope.target = badValue;
				scope.$digest();

				isInvalid();
			});
		});

		var passes = ["1", "75137", "1234567890123456789012345678901234567890", 789456];
		_.each(passes,(goodValue) => {
			it('passes "' + goodValue + '"',() => {
				scope.target = goodValue;
				scope.$digest();

				isValid();
			});
		});

	});
}