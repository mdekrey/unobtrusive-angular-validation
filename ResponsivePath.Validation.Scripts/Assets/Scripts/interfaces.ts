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

    export interface IErrorSet {
        [errorType: string]: boolean;
    };

    export interface IValidatedModelController extends ng.INgModelController {
        allValidationMessages: ITrustedHtmlByValidationKey;
        overrideValidationMessages: ITrustedHtmlByValidationKey;
        blurErrors: IErrorSet;
        submittedErrors: IErrorSet;
        activeErrors: IErrorSet;
    }

    export interface IValidatedFormController extends ng.IFormController {
        $$validationState: ScopeValidationState;
    }

    export interface IModelsByError {
        /* array of model controllers failing the error type */
        [errorType: string]: IValidatedModelController[];
    }

    export interface ScopeValidationState {
        blurErrors: IModelsByError;
        submittedErrors: IModelsByError;
        activeErrors: IModelsByError;
        blurred(): void;
        submitted(): void;
    }

}