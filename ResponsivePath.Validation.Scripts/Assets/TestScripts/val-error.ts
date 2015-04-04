module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val-error', function () {
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

		it('shows for errored fields',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();

			var form = angular.element('<form />');
			var firstName = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
			form.append(firstName);
			var firstNameMsg = angular.element('<span data-val-error="Personal.FirstName"></span>');
			form.append(firstNameMsg);
			
			compile(form)(scope);

			firstName.triggerHandler('blur');
			scope.firstname = null;
			scope.lastname = null;
			scope.$digest();
			
			expect(firstNameMsg.hasClass('error')).to.be(true);

			form.remove();
		}));
		
		it('shows separately for fields',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();

			var form = angular.element('<form />');
			var firstName = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
			form.append(firstName);
			var firstNameMsg = angular.element('<span data-val-error="Personal.FirstName"></span>');
			form.append(firstNameMsg);

			var lastName = angular.element('<input type="text" data-val="true" data-val-required="You must provide a last name" name="Personal.LastName" ng-model="lastname" />');
			form.append(lastName);
			var lastNameMsg = angular.element('<span data-val-error="Personal.LastName"></span>');
			form.append(lastNameMsg);
			
			compile(form)(scope);

			firstName.triggerHandler('blur');
			lastName.triggerHandler('blur');
			scope.firstname = 'Matt';
			scope.lastname = null;
			scope.$digest();

			expect(firstNameMsg.hasClass('error')).to.be(false);
			expect(lastNameMsg.hasClass('error')).to.be(true);

			form.remove();
		}));
		
	});
}