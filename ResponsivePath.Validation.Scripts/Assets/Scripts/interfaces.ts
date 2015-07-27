module ResponsivePath.Validation.Unobtrusive {

    export interface ITrustedHtml {
    }

    export interface IMySCEService {
        // So that we don't have to use "any"
        trustAsHtml(value: any): ITrustedHtml;
    }

    export interface ValidateMethod {
        (value: any, option: Validator): boolean;
    }

    export interface ValidationType {
        validate: ValidateMethod;
        inject: string[];
    }

    export interface ValidatorCollection {
        [keyName: string]: Validator;
    }

    export interface ITrustedHtmlByValidationKey {
        [validationKey: string]: ITrustedHtml;
    }

    export interface ITrustedHtmlSet {
        [modelName: string]: ITrustedHtmlByValidationKey;
    }
    
    export interface ICompleteModel {
        [modelName: string]: any;
    }

    export interface IValidatedModelController extends ng.INgModelController {
        allValidationMessages: ITrustedHtmlByValidationKey;
        overrideValidationMessages: ITrustedHtmlByValidationKey;
        activeErrors: { [errorType: string]: boolean; };
    }

    export interface IValidatedFormController extends ng.IFormController {
        $validationState: ScopeValidationState;
    }

    export interface ScopeValidationState {
        data: ICompleteModel;
        activeErrors: { /* array of model controllers failing the error type */[errorType: string]: IValidatedModelController[]; };
    }

}