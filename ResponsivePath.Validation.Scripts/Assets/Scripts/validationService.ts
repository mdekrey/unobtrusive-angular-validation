module ResponsivePath.Validation.Unobtrusive {

    export interface GetMessageArray {
        (formController: ng.IFormController): ITrustedHtmlSet;
        (formController: ng.IFormController, modelName: string): ITrustedHtmlByValidationKey;
    }

    export class ValidationService {

        ensureValidation(formController: ng.IFormController): ScopeValidationState {
            var controller: IValidatedFormController = <IValidatedFormController>formController;
            return controller.$$validationState;
        }

        getValidation(validationType: string): ValidationType {
            return angular.copy(this.getValidationType(validationType));
        }

        buildValidation(formController: IValidatedFormController, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModelController: IValidatedModelController) {
            return new ValidationTools(attrs, ngModelController, this, formController, this.$injector, this.$sce, this.getValidationType);
        }


        messageArray: GetMessageArray = (formController: ng.IFormController, modelName?: string): any => {
            if (modelName) {
                return (<IValidatedModelController>formController[modelName]).allValidationMessages;
            }

            var result = {};
            angular.forEach(ValidationService.getModelNames(formController), (modelName: string) => {
                result[modelName] = (<IValidatedModelController>formController[modelName]).allValidationMessages;
            });
            return result;
        }

        activeMessageArray: GetMessageArray = (formController: ng.IFormController, modelName?: string): any => {
            if (modelName) {

                var modelController = <IValidatedModelController>formController[modelName];

                var result: ITrustedHtmlByValidationKey = {};
                angular.forEach(modelController.activeErrors, (value: boolean, key: string) => {
                    var message = modelController.overrideValidationMessages[key] || modelController.allValidationMessages[key];
                    if (value && message) {
                        result[key] = message;
                    }
                });
                return result;
            }
            else {
                var resultSet: ITrustedHtmlSet = {};
                angular.forEach(ValidationService.getModelNames(formController), (modelName: string) => {
                    resultSet[modelName] = this.activeMessageArray(formController, modelName);
                });
                return resultSet;
            }
        }
        clearModelName(formController: ng.IFormController, modelName: string) {
            delete formController[modelName];
        }

        getValidationTiming() {
            return this.validationMessagingTiming;
        }

        getShouldSetFormSubmitted() {
            return this.shouldSetFormSubmitted;
        }

        static getModelNames(formController: ng.IFormController) {
            var result = [];
            angular.forEach(Object.keys(formController), (key: string) => {
                if (key[0] == '$')
                    return;
                if (formController[key].$error) {
                    result.push(key);
                }
            });
            return result;
        }

        getDelayedValidClass(): string { return this.delayedValidClass; }
        getDelayedInvalidClass(): string { return this.delayedInvalidClass; }

        static $inject = ['$injector', '$sce', 'getValidationType', 'validationMessagingTiming', 'shouldSetFormSubmitted', 'delayedValidClass', 'delayedInvalidClass'];
        constructor(
            private $injector: ng.auto.IInjectorService,
            private $sce: IMySCEService,
            private getValidationType: (keyName: string) => ValidationType,
            private validationMessagingTiming: IValidationTiming,
            private shouldSetFormSubmitted: boolean,
            private delayedValidClass: string,
            private delayedInvalidClass: string) {
        }
    }

}