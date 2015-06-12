module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive valmsg-summary', function () {
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

		it('leaves original errors until submit',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();

			var form = angular.element('<form />');
			var valSummary = angular.element('<div class="validation-summary-errors" data-valmsg-summary="true"><ul><li>Error one</li><li>Error two</li></ul></div>');
			form.append(valSummary);
			compile(form)(scope);

			scope.$digest();

			expect(valSummary[0].innerText).to.contain('Error one');
			expect(valSummary[0].innerText).to.contain('Error two');
			expect(valSummary.hasClass('validation-summary-errors')).to.be(true);
			expect(valSummary.hasClass('validation-summary-valid')).to.be(false);
		}));

		it('clears original errors on submit',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();

			var form = angular.element('<form />');
			var valSummary = angular.element('<div class="validation-summary-errors" data-valmsg-summary="true"><ul><li>Error one</li><li>Error two</li></ul></div>');
			form.append(valSummary);
			var element = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
			form.append(element);
			var valSubmit = angular.element('<input type="submit" data-val-submit value="Submit" />');
			form.append(valSubmit);
			compile(form)(scope);

			scope.firstname = null;
			scope.$digest();
			valSubmit[0].click();

			expect(valSummary[0].innerText).to.contain('You must provide a first name');
			expect(valSummary[0].innerText).to.not.contain('Error one');
			expect(valSummary[0].innerText).to.not.contain('Error two');
			expect(valSummary.hasClass('validation-summary-errors')).to.be(true);
			expect(valSummary.hasClass('validation-summary-valid')).to.be(false);
		}));

		it('stays empty before submit',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();

			var form = angular.element('<form />');
			var valSummary = angular.element('<div class="validation-summary-valid" data-valmsg-summary="true"><ul><li style="display:none"></li></ul></div>');
			form.append(valSummary);
			var element = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
			form.append(element);
			compile(form)(scope);

			scope.firstname = null;
			scope.$digest();

			expect(valSummary[0].innerText).to.not.contain('You must provide a first name');
			expect(valSummary.hasClass('validation-summary-valid')).to.be(true);
			expect(valSummary.hasClass('validation-summary-errors')).to.be(false);
		}));

		it('populates after submit',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();

			var form = angular.element('<form />');
			var valSummary = angular.element('<div class="validation-summary-valid" data-valmsg-summary="true"><ul><li style="display:none"></li></ul></div>');
			form.append(valSummary);
			var element = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
			form.append(element);
			var valSubmit = angular.element('<input type="submit" data-val-submit value="Submit" />');
			form.append(valSubmit);
			compile(form)(scope);

			scope.firstname = null;
			scope.$digest();
			valSubmit[0].click();

			expect(valSummary[0].innerText).to.contain('You must provide a first name');
			expect(valSummary.hasClass('validation-summary-errors')).to.be(true);
			expect(valSummary.hasClass('validation-summary-valid')).to.be(false);
		}));

		it('shows only errored fields',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();

			var form = angular.element('<form />');
			var valSummary = angular.element('<div class="validation-summary-valid" data-valmsg-summary="true"><ul><li style="display:none"></li></ul></div>');
			form.append(valSummary);
			var firstName = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
			form.append(firstName);
			var lastName = angular.element('<input type="text" data-val="true" data-val-required="You must provide a last name" name="Personal.LastName" ng-model="lastname" />');
			form.append(lastName);
			var valSubmit = angular.element('<input type="submit" data-val-submit value="Submit" />');
			form.append(valSubmit);
			compile(form)(scope);
			
			scope.firstname = null;
			scope.lastname = null;
			scope.$digest();
			valSubmit[0].click();

			expect(valSummary[0].innerText).to.contain('You must provide a first name');
			expect(valSummary[0].innerText).to.contain('You must provide a last name');
			expect(valSummary.hasClass('validation-summary-errors')).to.be(true);
			expect(valSummary.hasClass('validation-summary-valid')).to.be(false);

			scope.firstname = 'Matt';
			scope.lastname = null;
			scope.$digest();

			expect(valSummary[0].innerText).not.to.contain('You must provide a first name');
			expect(valSummary[0].innerText).to.contain('You must provide a last name');
			expect(valSummary.hasClass('validation-summary-errors')).to.be(true);
			expect(valSummary.hasClass('validation-summary-valid')).to.be(false);
		}));

		it('is valid when submitting with no errors',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: any = $rootScope.$new();

			var form = angular.element('<form />');
			var valSummary = angular.element('<div class="validation-summary-valid" data-valmsg-summary="true"><ul><li style="display:none"></li></ul></div>');
			form.append(valSummary);
			var element = angular.element('<input type="text" data-val="true" data-val-required="You must provide a first name" name="Personal.FirstName" ng-model="firstname" />');
			form.append(element);
			var valSubmit = angular.element('<input type="submit" data-val-submit value="Submit" />');
			form.append(valSubmit);
			compile(form)(scope);

			scope.firstname = null;
			scope.$digest();
			valSubmit[0].click();

			expect(valSummary[0].innerText).to.contain('You must provide a first name');
			expect(valSummary.hasClass('validation-summary-errors')).to.be(true);
			expect(valSummary.hasClass('validation-summary-valid')).to.be(false);

			scope.firstname = 'Matt';
			scope.$digest();

			expect(valSummary[0].innerText).to.not.contain('You must provide a first name');
			expect(valSummary.hasClass('validation-summary-valid')).to.be(true);
			expect(valSummary.hasClass('validation-summary-errors')).to.be(false);
        }));

        it('removes duplicate messages',() => inject(($rootScope: angular.IRootScopeService) => {
            var scope: any = $rootScope.$new();

            var form = angular.element('<form />');
            var valSummary = angular.element('<div class="validation-summary-valid" data-valmsg-summary="true"><ul><li style="display:none"></li></ul></div>');
            form.append(valSummary);
            var element = angular.element('<input type="text" data-val="true" data-val-required="All fields are required" name="Personal.FirstName" ng-model="firstname" />');
            form.append(element);
            element = angular.element('<input type="text" data-val="true" data-val-required="All fields are required" name="Personal.LastName" ng-model="lastname" />');
            form.append(element);
            var valSubmit = angular.element('<input type="submit" data-val-submit value="Submit" />');
            form.append(valSubmit);
            compile(form)(scope);

            scope.firstname = null;
            scope.lastname = null;
            scope.$digest();
            valSubmit[0].click();

            expect(valSummary[0].innerText).to.contain('All fields are required');
            expect(valSummary[0].innerText).not.to.contain('All fields are requiredAll fields are required');
            expect(valSummary[0].innerText).not.to.contain('All fields are required All fields are required');
            expect(valSummary.hasClass('validation-summary-errors')).to.be(true);
            expect(valSummary.hasClass('validation-summary-valid')).to.be(false);

            scope.firstname = 'Matt';
            scope.$digest();

            expect(valSummary[0].innerText).to.contain('All fields are required');
            expect(valSummary.hasClass('validation-summary-errors')).to.be(true);
            expect(valSummary.hasClass('validation-summary-valid')).to.be(false);

            scope.lastname = 'Matt';
            scope.$digest();

            expect(valSummary[0].innerText).not.to.contain('All fields are required');
            expect(valSummary.hasClass('validation-summary-valid')).to.be(true);
            expect(valSummary.hasClass('validation-summary-errors')).to.be(false);
        }));
	});
}