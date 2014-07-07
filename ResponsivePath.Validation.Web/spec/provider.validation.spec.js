
describe('Validation provider configuration', function () {
    var theConfigProvider;

    beforeEach(function () {
        var fakeModule = angular.module('test.app.config', []);
        fakeModule.config(function (validationProvider) {
            theConfigProvider = validationProvider;
        });

        angular.injector(['ng', 'unobtrusive.validation', 'test.app.config']).invoke(function () {
        });
    });

    it('has standard .Net Framework validation types.', function () {
        var expectedTypes = ['required', 'regex', 'email', 'creditcard', 'date', 'digits', 'number', 'url', 'minlength', 'maxlength', 'length', 'range', 'password', 'equalto', 'extension', 'remote'];

        for (var i = 0; i < expectedTypes.length; i++) {
            expect(theConfigProvider.getValidationType(expectedTypes[i])).toBeTruthy();
        }
    });

    it('supports custom validation types.', function () {
        var targetFunc = function (val, options) {
            return !val || options.parameters['value'] == JSON.stringify(val);
        };
        theConfigProvider.addValidator('exactvalue', targetFunc, ['validation']);

        var validationType = theConfigProvider.getValidationType('exactvalue');
        expect(validationType.validate).toEqual(targetFunc);
        expect(validationType.inject).toEqual(['validation']);
    });

});


describe('Validation provider', function () {
    var  validationProvider, rootScope;

    beforeEach(module('ng', 'unobtrusive.validation'));

    beforeEach(inject(function (validation, $rootScope) {
        validationProvider = validation;
        rootScope = $rootScope;
    }));

    it('stores data in a scope.', function () {
        var myScope = rootScope.$new();
        var childScope = myScope.$new();
        var expected = validationProvider.ensureValidation(myScope);

        var actual = validationProvider.ensureValidation(myScope);
        expect(actual).toBe(expected);

        actual = validationProvider.ensureValidation(rootScope);
        expect(actual).not.toBe(expected);
    });
});