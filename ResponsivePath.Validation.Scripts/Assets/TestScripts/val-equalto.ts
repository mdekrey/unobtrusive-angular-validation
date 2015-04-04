module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val-equalto', function () {
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
		var fieldName: string = 'Obj.Target';
		var message: string = 'Invalid';
		var form: angular.IAugmentedJQuery;
		var element: angular.IAugmentedJQuery;
		var matchElement: angular.IAugmentedJQuery;

		beforeEach(() => {
			scope = rootScope.$new();
			valScope = validation.ensureValidation(scope);

			form = angular.element('<form name="form"/>');
			element = angular.element('<input type="text" data-val="true" name="Obj.Target" ng-model="target" data-val-equalto="Invalid" data-val-equalto-other="*.Other" />');
			matchElement = angular.element('<input type="text" data-val="true" name="Obj.Other" ng-model="other" />');
			form.append(element);
			form.append(matchElement);
			compile(form)(scope);
			scope.form['Obj.Other'].$setViewValue('othervalue');
			scope.$digest();
			valScope.cancelSuppress = true;
		});

		function isValid() {
			expect(valScope.messages[fieldName]).not.to.have.key('equalto');
		}

		function isInvalid() {
			expect(sce.getTrustedHtml(valScope.messages[fieldName]['equalto'])).to.equal(message);
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

		it('fails an incorrect value',() => {
			scope.target = '0';
			scope.$digest();

			isInvalid();
		});

		it('passes a correct value',() => {
			scope.target = 'othervalue';
			scope.$digest();

			isValid();
		});

	});
}