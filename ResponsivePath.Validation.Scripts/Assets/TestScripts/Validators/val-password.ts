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

        var scope: ng.IScope;
		var fieldName: string = 'Target';
		var message: string = 'Invalid';
		var element: angular.IAugmentedJQuery;

        function isValid() {
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.be(false);
        }

        function isInvalid() {
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.be(true);
        }

		describe('complex', function () {
			beforeEach(() => {
				scope = rootScope.$new();

				element = compile('<form><input type="text" data-val="true" name="Target" ng-model="target" data-val-password="Invalid" data-val-password-min="6" data-val-password-nonalphamin="2" data-val-password-regex="^.{5,8}$" /></form>')(scope);
                element = element.find('input');
			});

			it('passes a null value',() => {
				scope['target'] = null;
				scope.$digest();

				isValid();
			});

			it('passes an empty value',() => {
				scope['target'] = '';
				scope.$digest();

				isValid();
			});

			var failed = ["abc!!", "abcdef", "abcdefgh!!"];
			_.each(failed,(badValue) => {
				it('fails "' + badValue + '"',() => {
					scope['target'] = badValue;
					scope.$digest();

					isInvalid();
				});
			});

			var passes = ["abcd!!", "test!@#$"];
			_.each(passes,(goodValue) => {
				it('passes "' + goodValue + '"',() => {
					scope['target'] = goodValue;
					scope.$digest();

					isValid();
				});
			});
		});

		describe('min only', function () {
			beforeEach(() => {
				scope = rootScope.$new();

				element = compile('<form><input type="text" data-val="true" name="Target" ng-model="target" data-val-password="Invalid" data-val-password-min="6"/></form>')(scope);
                element = element.find('input');
			});

			it('passes a null value',() => {
				scope['target'] = null;
				scope.$digest();

				isValid();
			});

			it('passes an empty value',() => {
				scope['target'] = '';
				scope.$digest();

				isValid();
			});

			var failed = ["abc!!"];
			_.each(failed,(badValue) => {
				it('fails "' + badValue + '"',() => {
					scope['target'] = badValue;
					scope.$digest();

					isInvalid();
				});
			});

			var passes = ["abcd!!", "test!@#$", "abcdef", "abcdefgh!!"];
			_.each(passes,(goodValue) => {
				it('passes "' + goodValue + '"',() => {
					scope['target'] = goodValue;
					scope.$digest();

					isValid();
				});
			});
		});

		describe('regex only', function () {
			beforeEach(() => {
				scope = rootScope.$new();

				element = compile('<form><input type="text" data-val="true" name="Target" ng-model="target" data-val-password="Invalid" data-val-password-regex="^.{5,8}$" /></form>')(scope);
                element = element.find('input');
			});

			it('passes a null value',() => {
				scope['target'] = null;
				scope.$digest();

				isValid();
			});

			it('passes an empty value',() => {
				scope['target'] = '';
				scope.$digest();

				isValid();
			});

			var failed = ["abcdefgh!!"];
			_.each(failed,(badValue) => {
				it('fails "' + badValue + '"',() => {
					scope['target'] = badValue;
					scope.$digest();

					isInvalid();
				});
			});

			var passes = ["abc!!", "abcdef", "abcd!!", "test!@#$"];
			_.each(passes,(goodValue) => {
				it('passes "' + goodValue + '"',() => {
					scope['target'] = goodValue;
					scope.$digest();

					isValid();
				});
			});
		});

		describe('nonalphamin only', function () {
			beforeEach(() => {
				scope = rootScope.$new();

				element = compile('<form><input type="text" data-val="true" name="Target" ng-model="target" data-val-password="Invalid" data-val-password-nonalphamin="2"" /></form>')(scope);
                element = element.find('input');
			});

			it('passes a null value',() => {
				scope['target'] = null;
				scope.$digest();

				isValid();
			});

			it('passes an empty value',() => {
				scope['target'] = '';
				scope.$digest();

				isValid();
			});

			var failed = ["abcdef"];
			_.each(failed,(badValue) => {
				it('fails "' + badValue + '"',() => {
					scope['target'] = badValue;
					scope.$digest();

					isInvalid();
				});
			});

			var passes = ["abc!!", "abcd!!", "test!@#$", "abcdefgh!!"];
			_.each(passes,(goodValue) => {
				it('passes "' + goodValue + '"',() => {
					scope['target'] = goodValue;
					scope.$digest();

					isValid();
				});
			});
		});
	});
}