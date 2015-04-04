module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val-password', function () {
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

		function isValid() {
			expect(valScope.messages[fieldName]).not.to.have.key('password');
		}

		function isInvalid() {
			expect(sce.getTrustedHtml(valScope.messages[fieldName]['password'])).to.equal(message);
		}

		describe('complex', function () {
			beforeEach(() => {
				scope = rootScope.$new();
				valScope = validation.ensureValidation(scope);

				element = compile('<input type="text" data-val="true" name="Target" ng-model="target" data-val-password="Invalid" data-val-password-min="6" data-val-password-nonalphamin="2" data-val-password-regex="^.{5,8}$" />')(scope);
				valScope.cancelSuppress = true;
			});

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

			var failed = ["abc!!", "abcdef", "abcdefgh!!"];
			_.each(failed,(badValue) => {
				it('fails "' + badValue + '"',() => {
					scope.target = badValue;
					scope.$digest();

					isInvalid();
				});
			});

			var passes = ["abcd!!", "test!@#$"];
			_.each(passes,(goodValue) => {
				it('passes "' + goodValue + '"',() => {
					scope.target = goodValue;
					scope.$digest();

					isValid();
				});
			});
		});

		describe('min only', function () {
			beforeEach(() => {
				scope = rootScope.$new();
				valScope = validation.ensureValidation(scope);

				element = compile('<input type="text" data-val="true" name="Target" ng-model="target" data-val-password="Invalid" data-val-password-min="6"/>')(scope);
				valScope.cancelSuppress = true;
			});

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

			var failed = ["abc!!"];
			_.each(failed,(badValue) => {
				it('fails "' + badValue + '"',() => {
					scope.target = badValue;
					scope.$digest();

					isInvalid();
				});
			});

			var passes = ["abcd!!", "test!@#$", "abcdef", "abcdefgh!!"];
			_.each(passes,(goodValue) => {
				it('passes "' + goodValue + '"',() => {
					scope.target = goodValue;
					scope.$digest();

					isValid();
				});
			});
		});

		describe('regex only', function () {
			beforeEach(() => {
				scope = rootScope.$new();
				valScope = validation.ensureValidation(scope);

				element = compile('<input type="text" data-val="true" name="Target" ng-model="target" data-val-password="Invalid" data-val-password-regex="^.{5,8}$" />')(scope);
				valScope.cancelSuppress = true;
			});

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

			var failed = ["abcdefgh!!"];
			_.each(failed,(badValue) => {
				it('fails "' + badValue + '"',() => {
					scope.target = badValue;
					scope.$digest();

					isInvalid();
				});
			});

			var passes = ["abc!!", "abcdef", "abcd!!", "test!@#$"];
			_.each(passes,(goodValue) => {
				it('passes "' + goodValue + '"',() => {
					scope.target = goodValue;
					scope.$digest();

					isValid();
				});
			});
		});

		describe('nonalphamin only', function () {
			beforeEach(() => {
				scope = rootScope.$new();
				valScope = validation.ensureValidation(scope);

				element = compile('<input type="text" data-val="true" name="Target" ng-model="target" data-val-password="Invalid" data-val-password-nonalphamin="2"" />')(scope);
				valScope.cancelSuppress = true;
			});

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

			var failed = ["abcdef"];
			_.each(failed,(badValue) => {
				it('fails "' + badValue + '"',() => {
					scope.target = badValue;
					scope.$digest();

					isInvalid();
				});
			});

			var passes = ["abc!!", "abcd!!", "test!@#$", "abcdefgh!!"];
			_.each(passes,(goodValue) => {
				it('passes "' + goodValue + '"',() => {
					scope.target = goodValue;
					scope.$digest();

					isValid();
				});
			});
		});
	});
}