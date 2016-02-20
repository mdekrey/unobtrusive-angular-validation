module ResponsivePath.Validation.Unobtrusive.Tests {
    describe('Unit: Directive val', function () {
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

		it('registers validation',() => inject(($rootScope: angular.IRootScopeService) => {
			var scope: ng.IScope = $rootScope.$new();

            var element = compile('<form><input type="text" data-val="true" data-val-required="You must provide a first name" name="FirstName" ng-model="firstname" /></form>')(scope);
            var valScope = validation.ensureValidation(element.controller('form'));
            element = element.find('input');
			scope['firstname'] = null;
			scope.$digest();

            expect(sce.getTrustedHtml(validation.activeMessageArray(element.controller('form'), 'FirstName')['required'])).to.equal('You must provide a first name');
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.equal(true);
		}));

		it('don\'t fail for value attribute',() => inject(($rootScope: angular.IRootScopeService) => {
            var scope: ng.IScope = $rootScope.$new();

			var element = compile('<form><input type="text" data-val="true" data-val-required="You must provide a first name" name="FirstName" ng-model="firstname" value="Matt" /></form>')(scope);
            var valScope = validation.ensureValidation(element.controller('form'));
            element = element.find('input');
            scope['firstname'] = null;
			scope.$digest();

            expect(sce.getTrustedHtml(validation.activeMessageArray(element.controller('form'), 'FirstName')['required'])).to.equal('You must provide a first name');
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.equal(true);
		}));

		it('don\'t fail for unknown attribute',() => inject(($rootScope: angular.IRootScopeService) => {
            var scope: ng.IScope = $rootScope.$new();

			var element = compile('<form><input type="text" data-val="true" data-val-required="You must provide a first name" name="FirstName" ng-model="firstname" val-unknown /></form>')(scope);
            var valScope = validation.ensureValidation(element.controller('form'));
            var formController = element.controller('form');
            element = element.find('input');
            scope['firstname'] = null;
			scope.$digest();

            expect(sce.getTrustedHtml(validation.activeMessageArray(formController, 'FirstName')['required'])).to.equal('You must provide a first name');
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.equal(true);
		}));

		it('ignores if @val is not true',() => inject(($rootScope: angular.IRootScopeService) => {
            var scope: ng.IScope = $rootScope.$new();

			var element = compile('<form><input type="text" data-val="false" data-val-required="You must provide a first name" name="FirstName" ng-model="firstname" /></form>')(scope);
            var valScope = validation.ensureValidation(element.controller('form'));
            var formController = element.controller('form');
            element = element.find('input');
            scope['firstname'] = null;
			scope.$digest();
            
            expect(sce.getTrustedHtml(validation.messageArray(formController, 'FirstName')['required'])).to.equal('You must provide a first name');
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.equal(false);
		}));
        
		it('ignores if @val-if becomes false',() => inject(($rootScope: angular.IRootScopeService) => {
            var scope: ng.IScope = $rootScope.$new();

			var element = compile('<form><input type="text" data-val="true" data-val-if="validate" data-val-required="You must provide a first name" name="FirstName" ng-model="firstname" /></form>')(scope);
            var valScope = validation.ensureValidation(element.controller('form'));
            element = element.find('input');
            scope['validate'] = true;
            scope['firstname'] = null;
			scope.$digest();
            
            expect(sce.getTrustedHtml(validation.activeMessageArray(element.controller('form'), 'FirstName')['required'])).to.equal('You must provide a first name');
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.equal(true);

            scope['validate'] = false;
			scope.$digest();
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.equal(false);
		}));

		it('destroys',() => inject(($rootScope: angular.IRootScopeService) => {
            var scope: ng.IScope = $rootScope.$new();

			var element = compile('<form><input type="text" data-val="true" data-val-required="You must provide a first name" name="FirstName" ng-model="firstname" /></form>')(scope);
            var valScope = validation.ensureValidation(element.controller('form'));
            var formController: IValidatedFormController = element.controller('form');
            element = element.find('input');
            scope['firstname'] = null;
			scope.$digest();

			element.remove();
            scope.$digest();
            expect(validation.activeMessageArray(formController)).not.to.have.key('FirstName');
		}));
        
	});
}