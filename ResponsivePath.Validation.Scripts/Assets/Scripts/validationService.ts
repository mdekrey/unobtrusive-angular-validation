module ResponsivePath.Validation.Unobtrusive {

    export interface GetMessageArray {
        (formController: ng.IFormController): ITrustedHtmlSet;
        (formController: ng.IFormController, modelName: string): ITrustedHtmlByValidationKey;
    }
    export interface GetSetMessageArray extends GetMessageArray {
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
            var state: ScopeValidationState = controller.validationState || { messages: {}, data: {}, activeErrors: null };
            controller.validationState = state;
            return state;
        }

        getValidation(validationType: string): ValidationType {
            return angular.copy(this.getValidationType(validationType));
        }

        buildValidation(formController: IValidatedFormController, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModelController: IValidatedModelController) {
            return new ValidationTools(attrs, ngModelController, this, formController, this.$injector, this.$sce, this.getValidationType);
        }


        messageArray: GetSetMessageArray = (formController: ng.IFormController, modelName?: string, setter?: ITrustedHtmlByValidationKey): any => {
            if (modelName) {
                if (setter !== undefined) {
                    this.ensureValidation(formController).messages[modelName] = setter;
                }
                return this.ensureValidation(formController).messages[modelName];
            }
            return this.ensureValidation(formController).messages;
        }

        activeMessageArray: GetMessageArray = (formController: ng.IFormController, modelName?: string): any => {
            var messages = this.ensureValidation(formController).messages;
            if (modelName) {

                var modelController = <IValidatedModelController>formController[modelName];

                var result: ITrustedHtmlByValidationKey = {};
                angular.forEach(modelController.activeErrors || modelController.$error, (value: boolean, key: string) => {
                    if (value && messages[modelName][key]) {
                        result[key] = messages[modelName][key];
                    }
                });
                return result;
            }
            else {
                var resultSet: ITrustedHtmlSet = {};
                angular.forEach(messages, (value: ITrustedHtmlByValidationKey, modelName: string) => {
                    resultSet[modelName] = this.activeMessageArray(formController, modelName);
                });
                return resultSet;
            }
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

        getValidationTiming() {
            return this.validationMessagingTiming;
        }

        getShouldSetFormSubmitted() {
            return this.shouldSetFormSubmitted;
        }

        copyValidation(formController: ng.IFormController) {
            if (this.getValidationTiming() == ValidationTiming.OnSubmit) {
                angular.forEach(Object.keys(formController), (key: string) => {
                    if (key[0] == '$')
                        return;
                    if (formController[key].$error) {
                        formController[key].activeErrors = angular.copy(formController[key].$error);
                    }
                });
            }

            this.ensureValidation(formController).activeErrors = angular.copy(formController.$error);
        }

        static $inject = ['$injector', '$sce', 'getValidationType', 'validationMessagingTiming', 'shouldSetFormSubmitted'];
        constructor(
            private $injector: ng.auto.IInjectorService,
            private $sce: IMySCEService,
            private getValidationType: (keyName: string) => ValidationType,
            private validationMessagingTiming: ValidationTiming,
            private shouldSetFormSubmitted: boolean) {
        }
    }

}