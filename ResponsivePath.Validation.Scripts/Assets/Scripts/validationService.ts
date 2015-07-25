module ResponsivePath.Validation.Unobtrusive {

    export interface GetSetMessageArray {
        (scope: ng.IScope): ITrustedHtmlSet;
        (scope: ng.IScope, modelName: string): ITrustedHtmlByValidationKey;
        (scope: ng.IScope, modelName: string, setMessages: ITrustedHtmlByValidationKey): ITrustedHtmlByValidationKey;
    }
    export interface GetSetModelValue {
        (scope: ng.IScope): ICompleteModel;
        (scope: ng.IScope, modelName: string): any;
        (scope: ng.IScope, modelName: string, setModelValue: any): any;
    }

    export class ValidationService {

        ensureValidation(scope: ng.IScope): ScopeValidationState {
            var state: ScopeValidationState = scope['$$ validation'] || { messages: {}, data: {} };
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
        dataValue: GetSetModelValue = (scope: ng.IScope, modelName?: string, setter?: any): any => {
            if (modelName) {
                if (setter !== undefined)
                    this.ensureValidation(scope).data[modelName] = setter;
                return this.ensureValidation(scope).data[modelName];
            }
            return this.ensureValidation(scope).data;
        }
        clearModelName(scope: ng.IScope, modelName: string) {
            var validation = this.ensureValidation(scope);
            delete this.ensureValidation(scope).messages[modelName];
            delete this.ensureValidation(scope).data[modelName];
        }

        static $inject = ['$injector', '$sce', 'getValidationType'];
        constructor(
            private $injector: ng.auto.IInjectorService,
            private $sce: IMySCEService,
            private getValidationType: (keyName: string) => ValidationType) {
        }
    }

}