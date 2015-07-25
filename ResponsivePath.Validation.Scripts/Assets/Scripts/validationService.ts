module ResponsivePath.Validation.Unobtrusive {

    export interface GetSetMessageArray {
        (formController: ng.IFormController): ITrustedHtmlSet;
        (formController: ng.IFormController, modelName: string): ITrustedHtmlByValidationKey;
        (formController: ng.IFormController, modelName: string, setMessages: ITrustedHtmlByValidationKey): ITrustedHtmlByValidationKey;
    }
    export interface GetSetModelValue {
        (formController: ng.IFormController): ICompleteModel;
        (formController: ng.IFormController, modelName: string): any;
        (formController: ng.IFormController, modelName: string, setModelValue: any): any;
    }

    export class ValidationService {

        ensureValidation(formController: ng.IFormController): ScopeValidationState {
            var controller: IValidatedFormController = <IValidatedFormController>formController;
            var state: ScopeValidationState = controller.state || { messages: {}, data: {} };
            controller.state = state;
            return state;
        }

        getValidation(validationType: string): ValidationType {
            return angular.copy(this.getValidationType(validationType));
        }

        buildValidation(formController: IValidatedFormController, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModelController: IValidatedModelController) {
            return new ValidationTools(attrs, ngModelController, this, formController, this.$injector, this.$sce, this.getValidationType);
        }


        messageArray: GetSetMessageArray = (formController: ng.IFormController, dotNetName?: string, setter?: ITrustedHtmlByValidationKey): any => {
            if (dotNetName) {
                if (setter !== undefined) {
                    this.ensureValidation(formController).messages[dotNetName] = setter;
                }
                return this.ensureValidation(formController).messages[dotNetName];
            }
            return this.ensureValidation(formController).messages;
        }
        dataValue: GetSetModelValue = (formController: ng.IFormController, modelName?: string, setter?: any): any => {
            if (modelName) {
                if (setter !== undefined)
                    this.ensureValidation(formController).data[modelName] = setter;
                return this.ensureValidation(formController).data[modelName];
            }
            return this.ensureValidation(formController).data;
        }
        clearModelName(formController: ng.IFormController, modelName: string) {
            var validation = this.ensureValidation(formController);
            delete this.ensureValidation(formController).messages[modelName];
            delete this.ensureValidation(formController).data[modelName];
        }

        static $inject = ['$injector', '$sce', 'getValidationType'];
        constructor(
            private $injector: ng.auto.IInjectorService,
            private $sce: IMySCEService,
            private getValidationType: (keyName: string) => ValidationType) {
        }
    }

}