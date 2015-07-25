module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val-maxlength', function () {
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

		beforeEach(() => {
			scope = rootScope.$new();

			element = compile('<form><input type="text" data-val="true" name="Target" ng-model="target" data-val-maxlength="Invalid" data-val-maxlength-max="3" /></form>')(scope);
            element = element.find('input');
		});

        function isValid() {
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.be(false);
        }

        function isInvalid() {
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.be(true);
        }

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

		var failed = ["15.000.1", "4.57", "75137", "1,000", "1234567890123456789012345678901234567890", "words"];
		_.each(failed,(badValue) => {
			it('fails "' + badValue+'"',() => {
				scope['target'] = badValue;
				scope.$digest();

				isInvalid();
			});
		});

		var passes = ["a", "(", "-1", "1", "abc"];
		_.each(passes,(goodValue) => {
			it('passes "' + goodValue + '"',() => {
				scope['target'] = goodValue;
				scope.$digest();

				isValid();
			});
		});

	});
}