
describe('Directive "val"', function () {
    var scope;

    beforeEach(module('ng', 'unobtrusive.validation'));

    beforeEach(inject(function ($rootScope) {
        scope = $rootScope.$new();
    }));

    function compileValTemplate(additionalAttributeString, scopeVarName, dotNetName) {
        var result = { scopeVarName: scopeVarName || 'someValue', dotNetName: dotNetName || 'SomeDotNetProperty' };
        var template = '<form><input type="text" data-val="true" ' + additionalAttributeString + ' name="' + result.dotNetName + '" data-ng-model="' + result.scopeVarName + '" /></form>';
        inject(function ($compile) {
            result.form = $compile(template)(scope);
            result.elem = result.form.find('input');
        });

        scope.$digest();

        result.elem.triggerHandler('blur');

        return result;
    }

    function expectInvalid(compileResult, valType, message) {
        if (valType) {
            inject(function (validation) {
                expect(validation.messageArray(scope, compileResult.dotNetName)[valType].$$unwrapTrustedValue()).toEqual(message);
            });
        }
        else {
            expect(compileResult.form.inheritedData('$formController').$valid).toEqual(false);
            expect(compileResult.form.inheritedData('$formController').$invalid).toEqual(true);
        }
    }

    function expectValid(compileResult, valType) {
        if (valType) {
            inject(function (validation) {
                expect(validation.messageArray(scope, compileResult.dotNetName)[valType]).toBeFalsy();
            });
        }
        else {
            expect(compileResult.form.inheritedData('$formController').$valid).toEqual(true);
            expect(compileResult.form.inheritedData('$formController').$invalid).toEqual(false);
        }
    }

    describe('handles validation type', function () {

        var message, compileResult, valType;
        function runTests(validValues, invalidValues, excludeRequired, afterAct) {
            var i;

            afterAct = afterAct || function () { };

            for (i = 0; i < validValues.length; i++) {
                (function (value) {
                    it('which treats [' + value + '] as valid.', function () {
                        // assign - all in setup

                        // act
                        scope.$apply(function () {
                            scope[compileResult.scopeVarName] = value;
                        });
                        afterAct();

                        // assert
                        expectValid(compileResult);
                        expectValid(compileResult, valType);
                    });
                })(validValues[i]);
            }

            for (i = 0; i < invalidValues.length; i++) {
                (function (value) {
                    it('which treats [' + value + '] as invalid.', function () {
                        // assign - all in setup

                        // act
                        scope.$apply(function () {
                            scope[compileResult.scopeVarName] = value;
                        });
                        afterAct();

                        // assert
                        expectInvalid(compileResult);
                        expectInvalid(compileResult, valType, message);
                    });
                })(invalidValues[i]);
            }

            if (!excludeRequired) {
                it('which doesn\'t enforce required.', function () {
                    // assign - all in setup

                    // act
                    scope.$apply(function () {
                        scope[compileResult.scopeVarName] = '';
                    });
                    afterAct();

                    // assert
                    expectValid(compileResult);
                    expectValid(compileResult, valType, message);
                });
            }
        }

        describe('"required"', function () {
            beforeEach(function () {
                valType = 'required';
                message = 'This is <b>required</b>.';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '"');
            });

            runTests(['abc', 'test'], [''], true);
        });

        describe('"regex"', function () {
            beforeEach(function () {
                valType = 'regex';
                message = 'May only contain the letters c, d, and e.';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '" data-val-' + valType + '-pattern="^[c-e]+$"');
            });

            runTests(['cccddeeee', 'cde'], ['abc', 'test']);
        });

        describe('"email"', function () {
            beforeEach(function () {
                valType = 'email';
                message = 'This must be an email.';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '"');
            });

            runTests(['test@example.com', 'business@responsivepath.com', 'careers@responsivepath.com'], ['not an email', 'test']);
        });

        describe('"creditcard"', function () {
            beforeEach(function () {
                valType = 'creditcard';
                message = 'This must be an credit card.';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '"');
            });

            runTests(['4444444444444448', '5454545454545454'], ['1234567']);
        });

        describe('"date"', function () {
            beforeEach(function () {
                valType = 'date';
                message = 'Dates.';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '"');
            });

            runTests(['04/11/2000', '1/31/2010', '1/1/1969'], ['1/32/2010', 'tomorrow']);
        });

        describe('"digits"', function () {
            beforeEach(function () {
                valType = 'digits';
                message = 'Must be digits only!';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '"');
            });

            runTests(['0', '123456', '00'], ['abc', '123.456', 'test', 'test@example']);
        });

        describe('"number"', function () {
            beforeEach(function () {
                valType = 'number';
                message = 'Must be a number!';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '"');
            });

            runTests(['0', '123.456', '123456'], ['abc', 'test', 'test@example']);
        });

        describe('"url"', function () {
            beforeEach(function () {
                valType = 'url';
                message = 'Must be a url!';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '"');
            });

            runTests([
                'http://www.responsivepath.com/',
                'https://www.google.com/search?q=responsive+path',
                'http://user:pass@www.example.com:8080/somepath?long#hash',
                'ftp://127.0.0.1'
            ], [
                '//user@pass:www.example.com',
                'http://localhost',
                'ssh://127.0.0.1'
            ]);
        });

        describe('"minlength"', function () {
            beforeEach(function () {
                valType = 'minlength';
                message = 'Minimum length of 6.';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '" data-val-' + valType + '-min="6"');
            });

            runTests([
                'tester',
                'abracadabra'
            ], [
                'test',
                'short'
            ]);
        });

        describe('"maxlength"', function () {
            beforeEach(function () {
                valType = 'maxlength';
                message = 'Maximum length of 5.';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '" data-val-' + valType + '-max="5"');
            });

            runTests([
                'test',
                'short'
            ], [
                'tester',
                'abracadabra'
            ]);
        });

        describe('"length"', function () {
            beforeEach(function () {
                valType = 'length';
                message = 'Minimum length of 5 and maximum length of 6.';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '" data-val-' + valType + '-min="5" data-val-' + valType + '-max="6"');
            });

            runTests([
                'tester',
                'short'
            ], [
                'test',
                'abracadabra'
            ]);
        });

        describe('"range"', function () {
            beforeEach(function () {
                valType = 'range';
                message = 'The value must be between 3.1 and 4.';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '" data-val-' + valType + '-min="3.1" data-val-' + valType + '-max="4"');
            });

            runTests([
                '3.1',
                '3.14159',
                '4'
            ], [
                'test',
                '5',
                '2.99999'
            ]);
        });

        describe('"password" with options {min:6,nonalphamin:1,regex:"([A-Z].*[a-z]|[a-z].*[A-Z])"}', function () {
            beforeEach(function () {
                valType = 'password';
                message = 'Your password is not secure enough.';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '" data-val-' + valType + '-min="6" data-val-' + valType + '-nonalphamin="1" data-val-' + valType + '-regex="([A-Z].*[a-z]|[a-z].*[A-Z])"');
            });

            runTests([
                'A123a!',
                'qwertY1?'
            ], [
                '123456!',
                '123456a@',
                'A123456?',
                'qwerty',
                'qwerty1',
                'q2A?'
            ]);
        });

        describe('"equalto"', function () {

            beforeEach(function () {
                valType = 'equalto';
                message = 'Only accepting HTML files.';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '" data-val-' + valType + '-other="SomeOther"');
                compileValTemplate('', 'secondValue', 'SomeOther');
                scope.$apply(function () {
                    scope.secondValue = 'correct value';
                });
            });

            // TODO - should "equalto" enforce required? I'm thinking yes, because data-val-if can be used to override this, and this is the usual case anyway.
            runTests([
                'correct value'
            ], [
                'wrong',
                'correct',
                'true'
            ], true);
        });

        describe('"extension" of html or htm', function () {
            beforeEach(function () {
                valType = 'extension';
                message = 'Only accepting HTML files.';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '" data-val-' + valType + '-extension="html,htm"');
            });

            runTests([
                'test.html',
                'test.htm'
            ], [
                'test.cshtml',
                'test.jpg',
                'testhtml'
            ]);
        });

        describe('"extension" without options', function () {
            beforeEach(function () {
                valType = 'extension';
                message = 'Only accepting HTML files.';
                compileResult = compileValTemplate('data-val-' + valType + '="' + message + '"');
            });

            runTests([
                'test.jpg',
                'test.jpeg',
                'test.png',
                'test.gif'
            ], [
                'test.cshtml',
                'test.html',
                'test.htm'
            ]);
        });

        describe('"remote"', function () {
                var backend;
                beforeEach(function () {
                    valType = 'remote';
                    message = 'Server invalid.';
                    compileResult = compileValTemplate('data-val-' + valType + '="' + message + '" data-val-' + valType + '-type="POST" data-val-' + valType + '-url="/validate" data-val-' + valType + '-additionalFields="Value1,Value2"');
                    compileValTemplate('', 'firstValue', 'Value1');
                    compileValTemplate('', 'secondValue', 'Value2');
                    scope.$apply(function () {
                        scope.firstValue = 'one';
                        scope.secondValue = 'two';
                    });
                    inject(function ($httpBackend) {
                        backend = $httpBackend;
                        $httpBackend.whenPOST('/validate', function () { return true; }).respond(function (method, url, data, headers) {
                            var clientData = angular.fromJson(data);
                            if (clientData[compileResult.dotNetName] == 'correct')
                                return [200, true];
                            else if (clientData[compileResult.dotNetName] == 'custom')
                                return [200, 'Custom message.'];
                            else
                                return [200, false];
                        });
                    });
                });

                runTests([
                    'correct'
                ], [
                    'bad'
                ], false, function () {
                    try {
                        backend.flush();
                    } catch (ex) {
                        // handle not having an http call for the default case
                    }
                });

                it('which treats [custom] as invalid with a custom message.', function () {
                    // assign - all in setup

                    // act
                    scope.$apply(function () {
                        scope[compileResult.scopeVarName] = 'custom';
                    });
                    backend.flush();

                    // assert
                    expectInvalid(compileResult);
                    expectInvalid(compileResult, valType, 'Custom message.');
                });
            });
    });
    
    describe('can handle multiple validators (email and required)', function () {
        var requiredMessage, emailMessage, compileResult;
        beforeEach(function () {
            requiredMessage = 'This is <b>required</b>.';
            emailMessage = 'This is <b>an email</b>.';
            compileResult = compileValTemplate('data-val-required="' + requiredMessage + '" data-val-email="' + emailMessage + '"');
        });

        it('which treats [test@example.com] as valid.', function () {
            // assign - all in setup

            // act
            scope.$apply(function () {
                scope[compileResult.scopeVarName] = 'test@example.com';
            });

            // assert
            expectValid(compileResult);
        });

        it('which treats [test] as invalid.', function () {
            // assign - all in setup

            // act
            scope.$apply(function () {
                scope[compileResult.scopeVarName] = 'test';
            });

            // assert
            expectInvalid(compileResult);
            expectInvalid(compileResult, 'email', emailMessage);
        });

        it('which is required.', function () {
            // assign - all in setup

            // act
            scope.$apply(function () {
                scope[compileResult.scopeVarName] = '';
            });

            // assert
            expectInvalid(compileResult);
            expectInvalid(compileResult, 'required', requiredMessage);
        });
    });

    describe('can be disabled', function () {
        var compileResult;
        beforeEach(function () {
            compileResult = compileValTemplate('data-val-required="message" data-val-if="shouldValidate"');
        });

        it('which is invalid when enabled and invalid.', function () {
            // assign - all in setup

            // act
            scope.$apply(function () {
                scope.shouldValidate = true;
                scope[compileResult.scopeVarName] = '';
            });

            // assert
            expectInvalid(compileResult);
            expectInvalid(compileResult, 'required', 'message');
        });

        it('which is valid when disabled and invalid.', function () {
            // assign - all in setup

            // act
            scope.$apply(function () {
                scope.shouldValidate = false;
                scope[compileResult.scopeVarName] = '';
            });

            // assert
            expectValid(compileResult);
            expectValid(compileResult, 'required');
        });

        it('which is valid when disabled and valid.', function () {
            // assign - all in setup

            // act
            scope.$apply(function () {
                scope.shouldValidate = false;
                scope[compileResult.scopeVarName] = 'valid';
            });

            // assert
            expectValid(compileResult);
            expectValid(compileResult, 'required');
        });

        it('which is valid when enabled and valid.', function () {
            // assign - all in setup

            // act
            scope.$apply(function () {
                scope.shouldValidate = true;
                scope[compileResult.scopeVarName] = 'valid';
            });

            // assert
            expectValid(compileResult);
            expectValid(compileResult, 'required');
        });
    });

    describe('can be flagged for realtime', function () {
        it('but when it isn\'t is disabled during focus.', function () {
            var compileResult = { scopeVarName: 'someValue', dotNetName: 'SomeDotNetProperty' };
            var valMessage = 'This is a required field';
            var template = '<form><input type="text" data-val="true" data-val-required="' + valMessage + '" name="' + compileResult.dotNetName + '" data-ng-model="' + compileResult.scopeVarName + '" /><span data-valmsg-for="' + compileResult.dotNetName + '"></span></form>';
            inject(function ($compile) {
                compileResult.form = $compile(template)(scope);
                compileResult.elem = compileResult.form.find('input');
                compileResult.span = compileResult.form.find('span');
            });

            scope.$digest();

            compileResult.elem.triggerHandler('focus');
            expect(compileResult.span.text().indexOf(valMessage)).toEqual(-1);

            compileResult.elem.triggerHandler('blur');
            expect(compileResult.span.text().indexOf(valMessage)).toBeGreaterThan(-1);
        });

        it('so that it doesn\'t suppress validation messages.', function () {
            var compileResult = { scopeVarName: 'someValue', dotNetName: 'SomeDotNetProperty' };
            var valMessage = 'This is a required field';
            var template = '<form><input type="text" data-val="true" data-val-required="' + valMessage + '" name="' + compileResult.dotNetName + '" data-val-realtime data-ng-model="' + compileResult.scopeVarName + '" /><span data-valmsg-for="' + compileResult.dotNetName + '"></span></form>';
            inject(function ($compile) {
                compileResult.form = $compile(template)(scope);
                compileResult.elem = compileResult.form.find('input');
                compileResult.span = compileResult.form.find('span');
            });

            scope.$digest();

            compileResult.elem.triggerHandler('focus');
            expect(compileResult.span.text().indexOf(valMessage)).toBeGreaterThan(-1);

            compileResult.elem.triggerHandler('blur');
            expect(compileResult.span.text().indexOf(valMessage)).toBeGreaterThan(-1);
        });
    });

});