module ResponsivePath.Validation.Unobtrusive {

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
        showValidationSummary: boolean = false;

        ensureValidation(scope: ng.IScope): ScopeValidationState {
            var state: ScopeValidationState = scope['$$ validation'] || { cancelSuppress: false, messages: {}, data: {} };
            scope['$$ validation'] = state;
            return state;
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
        }
        clearDotNetName(scope: ng.IScope, dotNetName: string) {
            var validation = this.ensureValidation(scope);
            delete this.ensureValidation(scope).messages[dotNetName];
            delete this.ensureValidation(scope).data[dotNetName];
        }

		static $inject = ['$injector','$sce','getValidationType'];
        constructor($injector: ng.auto.IInjectorService, $sce: IMySCEService, getValidationType: (keyName: string) => ValidationType) {
            this.$injector = $injector;
            this.$sce = $sce;
            this.getValidationType = getValidationType;
        }
    }

}