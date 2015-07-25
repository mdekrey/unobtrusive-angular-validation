module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: ValidationService', function () {
		beforeEach(module('unobtrusive.validation', 'ngMock'));

		var validation: ValidationService;

		beforeEach(inject((_validation_: ValidationService) => {
			validation = _validation_;
		}));

		describe('Validation Scoping...',() => {
			it('can get a unique validation scope',() => inject(($rootScope: angular.IRootScopeService) => {
				var scope = $rootScope.$new();
				var validationScope = validation.ensureValidation(scope);
				var validationScope2 = validation.ensureValidation(scope);

				expect(validationScope).not.to.be(null);
				expect(validationScope).to.be(validationScope2);
			}));

			it('inherits validation scope with child scopes',() => inject(($rootScope: angular.IRootScopeService) => {
				var scope = $rootScope.$new();
				var childScope = scope.$new();
				var validationScope = validation.ensureValidation(scope);
				var validationScope2 = validation.ensureValidation(childScope);

				expect(validationScope).to.be(validationScope2);
			}));


			it('has separate validation in separate scopes',() => inject(($rootScope: angular.IRootScopeService) => {
				var scope = $rootScope.$new();
				var otherScope = $rootScope.$new();
				var validationScope = validation.ensureValidation(scope);
				var validationScope2 = validation.ensureValidation(otherScope);

				expect(validationScope).not.to.be(validationScope2);
			}));
		});
        
		describe('Getters/setters',() => {
			var compile: angular.ICompileService;
			var rootScope: angular.IRootScopeService;
			var sce: angular.ISCEService;

			beforeEach(inject(($compile: angular.ICompileService, $rootScope: angular.IRootScopeService, $sce: angular.ISCEService) => {
				compile = $compile;
				rootScope = $rootScope;
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
				form = angular.element('<form name="form"/>');
				element = angular.element('<input type="text" data-val="true" name="Obj.Target" ng-model="target" data-val-required="Invalid" />');
				matchElement = angular.element('<input type="text" data-val="true" name="Obj.Other" ng-model="other" />');
				form.append(element);
				form.append(matchElement);
				compile(form)(rootScope);
				scope = element.scope();
				valScope = validation.ensureValidation(scope);
                
				scope.form['Obj.Other'].$setViewValue('othervalue');
				scope.$digest();
			});

			it('can get and set messages',() => {
				expect(sce.getTrustedHtml(validation.messageArray(scope)['Obj.Target']['required'])).to.be('Invalid');
				expect(sce.getTrustedHtml(validation.messageArray(scope, 'Obj.Target')['required'])).to.be('Invalid');
				expect(sce.getTrustedHtml(validation.messageArray(scope, 'Obj.Target', { anothererror: sce.trustAsHtml('Something Else') })['anothererror'])).to.be('Something Else');
				expect(sce.getTrustedHtml(validation.messageArray(scope)['Obj.Target']['required'])).to.be(undefined);
				expect(sce.getTrustedHtml(validation.messageArray(scope)['Obj.Target']['anothererror'])).to.be('Something Else');
				expect(sce.getTrustedHtml(validation.messageArray(scope, 'Obj.Target')['anothererror'])).to.be('Something Else');
			});

			it('can get and object values',() => {
				expect(validation.dataValue(scope)['Obj.Other']).to.be('othervalue');
				expect(validation.dataValue(scope, 'Obj.Other')).to.be('othervalue');
				expect(validation.dataValue(scope, 'Obj.Other', 'something else')).to.be('something else');
				expect(validation.dataValue(scope)['Obj.Other']).to.be('something else');
				expect(validation.dataValue(scope, 'Obj.Other')).to.be('something else');
			});
		});
	});
}