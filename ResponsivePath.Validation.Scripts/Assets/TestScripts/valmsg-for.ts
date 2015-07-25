module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive valmsg-for', function () {
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

		it('shows for individual fields',() => inject(($rootScope: angular.IRootScopeService) => {
            var scope: ng.IScope = $rootScope.$new();

			var form = angular.element('<form />');
			var firstName = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
			form.append(firstName);
			var firstNameMsg = angular.element('<span class="field-validation-valid" data-valmsg-for="Personal.FirstName" data-valmsg-replace="true"></span>');
			form.append(firstNameMsg);

			var lastName = angular.element('<input type="text" data-val="true" data-val-required="You must provide a last name" name="Personal.LastName" ng-model="lastname" />');
			form.append(lastName);
			var lastNameMsg = angular.element('<span class="field-validation-valid" data-valmsg-for="Personal.LastName" data-valmsg-replace="true"></span>');
			form.append(lastNameMsg);
			
			compile(form)(scope);

			firstName.triggerHandler('blur');
			lastName.triggerHandler('blur');
			scope['firstname'] = null;
			scope['lastname'] = null;
			scope.$digest();

			expect(firstNameMsg[0].innerText).to.contain('You must provide a first name');
			expect(lastNameMsg[0].innerText).to.contain('You must provide a last name');
			expect(firstNameMsg.hasClass('field-validation-error')).to.be(true);
			expect(firstNameMsg.hasClass('field-validation-valid')).to.be(false);
			expect(lastNameMsg.hasClass('field-validation-error')).to.be(true);
			expect(lastNameMsg.hasClass('field-validation-valid')).to.be(false);

			form.remove();
		}));
		
		it('shows only errored fields',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: ng.IScope = $rootScope.$new();

			var form = angular.element('<form />');
			var firstName = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
			form.append(firstName);
			var firstNameMsg = angular.element('<span class="field-validation-valid" data-valmsg-for="Personal.FirstName" data-valmsg-replace="true"></span>');
			form.append(firstNameMsg);

			var lastName = angular.element('<input type="text" data-val="true" data-val-required="You must provide a last name" name="Personal.LastName" ng-model="lastname" />');
			form.append(lastName);
			var lastNameMsg = angular.element('<span class="field-validation-valid" data-valmsg-for="Personal.LastName" data-valmsg-replace="true"></span>');
			form.append(lastNameMsg);
			
			compile(form)(scope);

			firstName.triggerHandler('blur');
			lastName.triggerHandler('blur');
			scope['firstname'] = 'Matt';
			scope['lastname'] = null;
			scope.$digest();

			expect(firstNameMsg[0].innerText).not.to.contain('You must provide a first name');
			expect(lastNameMsg[0].innerText).to.contain('You must provide a last name');
			expect(firstNameMsg.hasClass('field-validation-error')).to.be(false);
			expect(firstNameMsg.hasClass('field-validation-valid')).to.be(true);
			expect(lastNameMsg.hasClass('field-validation-error')).to.be(true);
			expect(lastNameMsg.hasClass('field-validation-valid')).to.be(false);

			form.remove();
		}));
		
	});
}