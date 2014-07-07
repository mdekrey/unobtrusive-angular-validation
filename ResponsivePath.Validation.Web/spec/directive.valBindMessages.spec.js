
describe('Directive "valBindMessages"', function () {
    var scope;

    beforeEach(module('ng', 'unobtrusive.validation'));

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('updates messages on the scope.', function () {
        // assign
        var dotNetName = 'SomeDotNetProperty';
        var template = '<form data-val-bind-messages="validationMessages"></form>';
        inject(function ($compile, validation) {
            $compile(template)(scope);
        });

        scope.$digest();

        // act
        scope.$apply(function () {
            scope.validationMessages = [
                { memberName: dotNetName, text: 'This is a test' },
                { memberName: dotNetName, text: 'This is another <span>test</span>' }
            ];
        });

        // assert
        inject(function (validation) {
            expect(validation.messageArray(scope, dotNetName)[0].$$unwrapTrustedValue()).toEqual('This is a test');
            expect(validation.messageArray(scope, dotNetName)[1].$$unwrapTrustedValue()).toEqual('This is another <span>test</span>');
        });
    });

    it('ceases to function when destroyed.', function () {
        // assign
        var element;
        var dotNetName = 'SomeElement';
        var template = '<form data-val-bind-messages="validationMessages"></form>';
        inject(function ($compile, validation) {
            element = ($compile(template)(scope));
        });

        scope.$digest();

        element.triggerHandler('$destroy');

        scope.$digest();

        // act
        scope.$apply(function () {
            scope.validationMessages = [
                { memberName: dotNetName, text: 'This is a test' },
                { memberName: dotNetName, text: 'This is another <span>test</span>' }
            ];
        });

        // assert
        inject(function (validation) {
            expect(validation.messageArray(scope, dotNetName)).toBeFalsy();
        });
    });
});