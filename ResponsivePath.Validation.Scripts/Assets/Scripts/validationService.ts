module ResponsivePath.Validation.Unobtrusive {
    var cancelSuppressionEvent = 'unobtrusiveValidation-supression-cancel';
    var showValidationSummaryEvent = 'unobtrusiveValidation-summary-show';
    var hideValidationSummaryEvent = 'unobtrusiveValidation-summary-hide';

    export interface GetSetMessageArray {
        (scope: ng.IScope): ITrustedHtmlSet;
        (scope: ng.IScope, dotNetName: string): ITrustedHtmlByValidationKey;
        (scope: ng.IScope, dotNetName: string, setMessages: ITrustedHtmlByValidationKey): ITrustedHtmlByValidationKey;
    }
    export interface GetSetDotNetValue {
        (scope: ng.IScope): IDotNetModel;
        (scope: ng.IScope, dotNetName: string): any;
        (scope: ng.IScope, dotNetName: string, setModelValue: any): any;
    }

    export class ValidationService {
        private $injector: ng.auto.IInjectorService;
        private $sce: IMySCEService;
        private getValidationType: (s: string) => ValidationType;

        ensureValidation(scope: ng.IScope): ScopeValidationState {
            var state: ScopeValidationState = scope['$$ validation'] || { cancelSuppress: false, messages: {}, data: {}, showValidationSummary: false };
            scope.$on(cancelSuppressionEvent, (event) => {
                state.cancelSuppress = true;
            });
            scope.$on(showValidationSummaryEvent, (event) => {
                state.showValidationSummary = true;
            });
            scope.$on(hideValidationSummaryEvent, (event) => {
                state.showValidationSummary = false;
            });
            scope['$$ validation'] = state;
            return state;
        }

        getValidation(validationType: string): ValidationType {
            return angular.copy(this.getValidationType(validationType));
        }

        buildValidation(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModelController: IValidatedModelController) {
            return new ValidationTools(attrs, ngModelController, this, scope, this.$injector, this.$sce, this.getValidationType);
        }

        messageArray: GetSetMessageArray = (scope: ng.IScope, dotNetName?: string, setter?: ITrustedHtmlByValidationKey): any => {
            if (dotNetName) {
                if (setter !== undefined) {
                    this.ensureValidation(scope).messages[dotNetName] = setter;
                }
                return this.ensureValidation(scope).messages[dotNetName];
            }
            return this.ensureValidation(scope).messages;
        }
        dataValue: GetSetDotNetValue = (scope: ng.IScope, dotNetName?: string, setter?: any): any => {
            if (dotNetName) {
                if (setter !== undefined)
                    this.ensureValidation(scope).data[dotNetName] = setter;
                return this.ensureValidation(scope).data[dotNetName];
            }
            return this.ensureValidation(scope).data;
        }
        hasCancelledSuppress = (scope: ng.IScope) => {
            return this.ensureValidation(scope).cancelSuppress;
        }
        cancelSuppress(scope: ng.IScope) {
            this.ensureValidation(scope).cancelSuppress = true;
            scope.$broadcast(cancelSuppressionEvent);
        }
        clearDotNetName(scope: ng.IScope, dotNetName: string) {
            var validation = this.ensureValidation(scope);
            delete this.ensureValidation(scope).messages[dotNetName];
            delete this.ensureValidation(scope).data[dotNetName];
        }

        validationSummaryVisible(scope: ng.IScope): boolean;
        validationSummaryVisible(scope: ng.IScope, value: boolean): void;

        validationSummaryVisible(scope: ng.IScope, value?: boolean): boolean {
            if (value === undefined)
                return this.ensureValidation(scope).showValidationSummary;
            else {
                this.ensureValidation(scope).showValidationSummary = value;
                if (value)
                    scope.$broadcast(showValidationSummaryEvent);
                else
                    scope.$broadcast(hideValidationSummaryEvent);
            }
        }

        static $inject = ['$injector', '$sce', 'getValidationType'];
        constructor($injector: ng.auto.IInjectorService, $sce: IMySCEService, getValidationType: (keyName: string) => ValidationType) {
            this.$injector = $injector;
            this.$sce = $sce;
            this.getValidationType = getValidationType;
        }
    }

}