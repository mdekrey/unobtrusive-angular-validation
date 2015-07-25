module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val-extension', function () {
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
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.be(false);
        }

        function isInvalid() {
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.be(true);
        }

		describe('default', function () {
			beforeEach(() => {
				scope = rootScope.$new();
				valScope = validation.ensureValidation(scope);

				element = compile('<input type="text" data-val="true" name="Target" ng-model="target" data-val-extension="Invalid" />')(scope);
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

			var failed = ["file", "file.txt"];
			_.each(failed,(badValue) => {
				it('fails "' + badValue + '"',() => {
					scope.target = badValue;
					scope.$digest();

					isInvalid();
				});
			});

			var passes = ["file.png", "something.jpg", "some/path/to/image.jpeg", "C:/some/path/to/image.gif"];
			_.each(passes,(goodValue) => {
				it('passes "' + goodValue + '"',() => {
					scope.target = goodValue;
					scope.$digest();

					isValid();
				});
			});
		});

		describe('specified as "doc,docx,pdf,txt"', function () {
			beforeEach(() => {
				scope = rootScope.$new();
				valScope = validation.ensureValidation(scope);

				element = compile('<input type="text" data-val="true" name="Target" ng-model="target" data-val-extension="Invalid" data-val-extension-extension="doc,docx,pdf,txt" />')(scope);
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

			var failed = ["file", "file.png", "something.jpg", "some/path/to.docx/image.jpeg", "C:/some/path/to/image.gif"];
			_.each(failed,(badValue) => {
				it('fails "' + badValue + '"',() => {
					scope.target = badValue;
					scope.$digest();

					isInvalid();
				});
			});

			var passes = ["file.doc", "something.docx", "some/path/to/file.txt", "C:/some/path/to/file.pdf"];
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