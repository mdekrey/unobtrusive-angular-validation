
describe('Directive "valmsgSummary"', function () {
    var scope;

    beforeEach(module('ng', 'unobtrusive.validation'));

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    it('supports initial state.', function () {
        // assign
        var elem;
        var template = '<form data-val-bind-messages="validationMessages"><div data-valmsg-summary><ul><li>This is a test</li><li>This is another <span>test</span></li><li><b>Other test</b></li></ul></div></form>';
        inject(function ($compile, validation) {
            var form = $compile(template)(scope);
            elem = form.find('div');
            validation.showValidationSummary = true;
        });

        scope.$digest();

        // act

        // assert
        inject(function (validation) {
            content = elem.html();
            expect(content.indexOf('This is a test')).toBeGreaterThan(-1);
            expect(content.indexOf('This is another <span>test</span>')).toBeGreaterThan(-1);
            expect(content.indexOf('<b>Other test</b>')).toBeGreaterThan(-1);
        });
    });

    it('lists out the all validation messages, when there are any.', function () {
        // assign
        var elem;
        var template = '<form data-val-bind-messages="validationMessages"><div data-valmsg-summary></div></form>';
        inject(function ($compile, validation) {
            var form = $compile(template)(scope);
            elem = form.find('div');
            validation.showValidationSummary = true;
        });

        scope.$digest();

        // act
        scope.$apply(function () {
            scope.validationMessages = [
                { memberName: 'SomeDotNetProperty', text: 'This is a test' },
                { memberName: 'SomeDotNetProperty', text: 'This is another <span>test</span>' },
                { memberName: 'OtherProperty', text: '<b>Other test</b>' }
            ];
        });

        // assert
        inject(function (validation) {
            content = elem.html();
            expect(content.indexOf('This is a test')).toBeGreaterThan(-1);
            expect(content.indexOf('This is another <span>test</span>')).toBeGreaterThan(-1);
            expect(content.indexOf('<b>Other test</b>')).toBeGreaterThan(-1);
            expect(elem.hasClass('validation-summary-valid')).toBeFalsy();
            expect(elem.hasClass('validation-summary-errors')).toBeTruthy();
        });
    });

    it('hides validation messages until the service is set to show them.', function () {
        // assign
        var elem;
        var template = '<form data-val-bind-messages="validationMessages"><div data-valmsg-summary></div></form>';
        inject(function ($compile, validation) {
            var form = $compile(template)(scope);
            elem = form.find('div');
            validation.showValidationSummary = false;
        });

        scope.$digest();

        // act
        scope.$apply(function () {
            scope.validationMessages = [
                { memberName: 'SomeDotNetProperty', text: 'This is a test' },
                { memberName: 'SomeDotNetProperty', text: 'This is another <span>test</span>' },
                { memberName: 'OtherProperty', text: '<b>Other test</b>' }
            ];
        });

        // assert
        inject(function (validation) {
            content = elem.html();
            expect(content.indexOf('This is a test')).toEqual(-1);
            expect(content.indexOf('This is another <span>test</span>')).toEqual(-1);
            expect(content.indexOf('<b>Other test</b>')).toEqual(-1);
            expect(elem.hasClass('validation-summary-valid')).toBeFalsy();
            expect(elem.hasClass('validation-summary-errors')).toBeFalsy();
        });
    });

    it('has no validation messages when there are none.', function () {
        // assign
        var elem;
        var template = '<form data-val-bind-messages="validationMessages"><div data-valmsg-summary><div data-valmsg-summary><ul><li>This is a test</li><li>This is another <span>test</span></li><li><b>Other test</b></li></ul></div></div></form>';
        inject(function ($compile, validation) {
            var form = $compile(template)(scope);
            elem = form.find('div');
            validation.showValidationSummary = true;
        });

        scope.$digest();
        scope.$apply(function () {
            scope.validationMessages = [
                { memberName: 'OtherProperty', text: '<b>Other test</b>' }
            ];
        });

        // act
        scope.$apply(function () {
            scope.validationMessages = [
            ];
        });

        // assert
        inject(function (validation) {
            content = elem.html();
            expect(content.indexOf('This is a test')).toEqual(-1);
            expect(content.indexOf('This is another <span>test</span>')).toEqual(-1);
            expect(content.indexOf('<b>Other test</b>')).toEqual(-1);
            expect(elem.hasClass('validation-summary-valid')).toBeTruthy();
            expect(elem.hasClass('validation-summary-errors')).toBeFalsy();
        });
    });
});