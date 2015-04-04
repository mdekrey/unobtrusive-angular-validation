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

		describe('Validation suppression...',() => {
			it('defaults to suppressing',() => inject(($rootScope: angular.IRootScopeService) => {
				var scope = $rootScope.$new();

				expect(validation.hasCancelledSuppress(scope)).to.be(false);
			}));

			it('allows validation suppress cancellation',() => inject(($rootScope: angular.IRootScopeService) => {
				var scope = $rootScope.$new();

				validation.cancelSuppress(scope);
				expect(validation.hasCancelledSuppress(scope)).to.be(true);
			}));	
		});
	});
}