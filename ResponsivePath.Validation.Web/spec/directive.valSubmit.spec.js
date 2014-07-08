
describe('Directive "valSubmit"', function () {
    var scope;
    var requiredMessage, emailMessage, form, summary, elem, button, dotNetName, scopeVarName;

    beforeEach(module('ng', 'unobtrusive.validation'));

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    beforeEach(inject(function ($rootScope) {
        scopeVarName = 'someValue';
        dotNetName = 'SomeDotNetProperty';
        requiredMessage = 'This is required.';
        emailMessage = 'This is supposed to be an email.';

        var template = '<form>' +
            '<input type="text" data-val="true" data-val-required="' + requiredMessage + '" data-val-email="' + emailMessage + '" name="' + dotNetName + '" data-ng-model="' + scopeVarName + '" />' +
            '<div data-valmsg-for="' + dotNetName + '"></div>' +
            '<button type="submit" data-val-submit />' +
            '</form>';

        inject(function ($compile) {
            form = $compile(template)(scope);
            summary = form.find('div');
            elem = form.find('input');
            button = form.find('button');
        });

        scope.$digest();
    }));

    it('reveals validation messages and prevents submit', function () {
        // assign

        // act
        button.triggerHandler('click');

        // assert
        // TODO - figure out some way to determine if it prevents submit
        //expect(eventArg.preventDefault).toHaveBeenCalled();
        expect(summary.text().indexOf(requiredMessage)).toBeGreaterThan(-1);
    });

    it('reveals validation messages and prevents submit', function () {
        // assign
        elem.triggerHandler('blur');

        scope.$apply(function () {
            scope[scopeVarName] = 'test';
        });
        expect(summary.text().indexOf(emailMessage)).toBeGreaterThan(-1);

        // act
        button.triggerHandler('click');

        // assert
        // TODO - figure out some way to determine if it prevents submit
        //expect(eventArg.preventDefault).toHaveBeenCalled();
        expect(summary.text().indexOf(emailMessage)).toBeGreaterThan(-1);
    });

    it('allows submit when everything is valid', function () {
        // assign
        var result = elem.triggerHandler('blur');

        scope.$apply(function () {
            scope[scopeVarName] = 'test@example.com';
        });
        expect(summary.text().indexOf(emailMessage)).toEqual(-1);

        // act
        button.triggerHandler('click');

        // assert
        // TODO - figure out some way to determine if it prevents submit
        //expect(eventArg.preventDefault).toHaveBeenCalled();
        expect(summary.text().indexOf(emailMessage)).toEqual(-1);
    });
});