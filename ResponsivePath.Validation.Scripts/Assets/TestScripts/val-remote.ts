module ResponsivePath.Validation.Unobtrusive.Tests {
	describe('Unit: Directive val-remote', function () {
		beforeEach(module('unobtrusive.validation', 'ngMock'));

		var compile: angular.ICompileService;
		var rootScope: angular.IRootScopeService;
		var validation: ValidationService;
		var sce: angular.ISCEService;
		var httpBackend: angular.IHttpBackendService;

		beforeEach(inject(($compile: angular.ICompileService, $rootScope: angular.IRootScopeService, _validation_: ValidationService, $sce: angular.ISCEService, $httpBackend: angular.IHttpBackendService) => {
			compile = $compile;
			rootScope = $rootScope;
			validation = _validation_;
			sce = $sce;
			httpBackend = $httpBackend;
		}));

        var scope: ng.IScope;
		var fieldName: string = 'Target';
		var message: string = 'Invalid';
		var element: angular.IAugmentedJQuery;

		beforeEach(() => {
			scope = rootScope.$new();

			var form = angular.element('<form name="form"/>');
			element = angular.element('<input type="text" data-val="true" name="Target" ng-model="target" data-val-remote="Invalid" data-val-remote-additionalfields="*.Other" data-val-remote-type="SPECIAL" data-val-remote-url="/some/path" />');
			var matchElement = angular.element('<input type="text" data-val="true" name="Other" ng-model="other" />');
			form.append(element);
			form.append(matchElement);
			compile(form)(scope);
			scope['form']['Other'].$setViewValue('othervalue');
			scope.$digest();
		});
		afterEach(() => { httpBackend.verifyNoOutstandingExpectation(); });
		afterEach(() => { httpBackend.verifyNoOutstandingRequest(); });

        function isValid() {
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.be(false);
        }

        function isInvalid(errorMessage?: string) {
            // TODO - verify custom error message
            expect((<ng.INgModelController>element.controller('ngModel')).$invalid).to.be(true);
        }

		it('passes a null value',() => {
			scope['target'] = null;
			scope.$digest();

			isValid();
		});

		it('passes an empty value',() => {
			scope['target'] = '';
			scope.$digest();

			isValid();
		});

		it('fails',() => {
			httpBackend.expect('SPECIAL', '/some/path', { 'Target': '0', 'Other': 'othervalue' }).respond(false);
			scope['target'] = '0';
			scope.$digest();

			isValid();
			httpBackend.flush();

			isInvalid();
		});

		it('fails with custom message',() => {
			httpBackend.expect('SPECIAL', '/some/path', { 'Target': '0', 'Other': 'othervalue' }).respond('Custom message');
			scope['target'] = '0';
			scope.$digest();

			isValid();
			httpBackend.flush();

			isInvalid('Custom message');
		});

		it('cancels previous calls',() => {
			httpBackend.when('SPECIAL', '/some/path', { 'Target': '0', 'Other': 'othervalue' }).respond(() => {
				throw new Error('Should have cancelled.');
			});
			scope['target'] = '0';
			scope.$digest();

			isValid();
			httpBackend.expect('SPECIAL', '/some/path', { 'Target': '01', 'Other': 'othervalue' }).respond(true);
			scope['target'] = '01';
			scope.$digest();

			isValid();
			httpBackend.flush();

			isValid();
		});

		it('passes',() => {
			httpBackend.expect('SPECIAL', '/some/path', { 'Target': '0', 'Other': 'othervalue' }).respond(true);
			scope['target'] = '0';
			scope.$digest();

			isValid();
			httpBackend.flush();

			isValid();
		});
	});
}