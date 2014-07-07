
describe('Directive "valmsgFor"', function () {
    var scope;

    beforeEach(module('ng', 'unobtrusive.validation'));

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('lists out the validation messages, when there are any.', function () {
        // assign
        var elem;
        var dotNetName = 'SomeDotNetProperty';
        var template = '<form data-val-bind-messages="validationMessages"><span data-valmsg-for="' + dotNetName + '"></span></form>';
        inject(function ($compile, validation) {
            var form = $compile(template)(scope);
            elem = form.find('span');
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
            var content = elem.html();
            expect(content.indexOf('This is a test')).toBeGreaterThan(-1);
            expect(content.indexOf('This is another <span>test</span>')).toBeGreaterThan(-1);
        });
    });

    it('hides the validation messages, when there are none.', function () {
        // assign
        var elem;
        var dotNetName = 'SomeDotNetProperty';
        var template = '<form data-val-bind-messages="validationMessages"><span class="error" data-valmsg-for="' + dotNetName + 'Other"></span></form>';
        inject(function ($compile, validation) {
            var form = $compile(template)(scope);
            elem = form.find('span');
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
            var content = elem.html();
            expect(content.indexOf('This is a test')).toEqual(-1);
            expect(content.indexOf('This is another <span>test</span>')).toEqual(-1);
        });
    });
});