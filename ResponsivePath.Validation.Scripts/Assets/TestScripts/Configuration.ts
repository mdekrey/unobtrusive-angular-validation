module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: ValidationProvider/Configuration', function () {
		var validationProvider: ValidationProvider = null;

		angular.module('fakes', ['unobtrusive.validation']).config((_validationProvider_: ValidationProvider) => {
			validationProvider = _validationProvider_;
		});

		beforeEach(module('unobtrusive.validation', 'ngMock', 'fakes'));

		beforeEach(inject(() => {
		}));

		var expectedValidators = [
			'required', 'regex', 'email', 'creditcard', 'date',
			'digits', 'number', 'url', 'minlength', 'maxlength', 'length',
			'range', 'password', 'equalto', 'extension', 'remote'];

		_.each(expectedValidators,(validator: string) => {
			it('has a "' + validator+'" validator',() => {
				expect(validationProvider.getValidationType(validator)).not.to.be(null);
			});
		});
	});
}