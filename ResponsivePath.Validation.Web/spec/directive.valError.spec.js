
describe('Directive "valError"', function () {
    var scope;

    beforeEach(module('ng', 'unobtrusive.validation'));

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('adds the error class when there are errors.', function () {
        // assign
        var elem;
        var dotNetName = 'SomeDotNetProperty';
        var template = '<form data-val-bind-messages="validationMessages"><div data-val-error="' + dotNetName + '"></div></form>'
        inject(function ($compile, validation) {
            var form = $compile(template)(scope);
            elem = form.find('div');
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
            expect(elem.hasClass('error')).toBe(true);
        });
    });

    it('removes the error class when there are no errors for the given name.', function () {
        // assign
        var elem;
        var dotNetName = 'SomeDotNetProperty';
        var template = '<form data-val-bind-messages="validationMessages"><div class="error" data-val-error="' + dotNetName + 'Other"></div></form>'
        inject(function ($compile, validation) {
            var form = $compile(template)(scope);
            elem = form.find('div');
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
            expect(elem.hasClass('error')).toBe(false);
        });
    });
});