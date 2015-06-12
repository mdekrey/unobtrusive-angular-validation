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
        [dotNetName: string]: ITrustedHtmlByValidationKey;
    }
    
    export interface IDotNetModel {
        [dotNetName: string]: any;
    }

    export interface IValidatedModelController extends ng.INgModelController {
        suppressValidationMessages: boolean;
        validationMessages: ITrustedHtmlByValidationKey;
    }

    export interface ScopeValidationState {
        cancelSuppress: boolean;
        showValidationSummary: boolean;
        messages: ITrustedHtmlSet;
        data: IDotNetModel;
    }

}