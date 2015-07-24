declare module ResponsivePath.Validation.Unobtrusive {
    function constructorAsInjectable<T>(targetClass: {
        new (...args: any[]): T;
    }): {
        (...args: any[]): T;
    };
}
declare module ResponsivePath.Validation.Unobtrusive {
    var mod: ng.IModule;
}
declare module ResponsivePath.Validation.Unobtrusive {
    interface IBoundMessage {
        memberName: string;
        text: string;
    }
}
declare module ResponsivePath.Validation.Unobtrusive {
}
declare module ResponsivePath.Validation.Unobtrusive {
}
declare module ResponsivePath.Validation.Unobtrusive {
}
declare module ResponsivePath.Validation.Unobtrusive {
    class ValidationTools {
        showValidationSummary: boolean;
        private validationEnabled;
        private validationFor;
        private ngModelController;
        private validators;
        private svc;
        private scope;
        private $injector;
        private $sce;
        private getValidationType;
        private buildValidatorsFromAttributes;
        constructor(attrs: ng.IAttributes, ngModelController: IValidatedModelController, svc: ValidationService, scope: ng.IScope, $injector: ng.auto.IInjectorService, $sce: IMySCEService, getValidationType: (keyName: string) => ValidationType);
        enable(): void;
        disable(): void;
        populateMessages(): void;
        runValidations: (newValue: any) => any;
        cancelSuppress(): void;
        enableSuppress(): void;
        fail: (key: string, message: string) => void;
        pass: (key: string) => void;
    }
}
declare module ResponsivePath.Validation.Unobtrusive {
}
declare module ResponsivePath.Validation.Unobtrusive {
}
declare module ResponsivePath.Validation.Unobtrusive {
    interface ITrustedHtml {
    }
    interface IMySCEService {
        trustAsHtml(value: any): ITrustedHtml;
    }
    interface ValidateMethod {
        (value: any, option: Validator): boolean;
    }
    interface ValidationType {
        validate: ValidateMethod;
        inject: string[];
    }
    interface ValidatorCollection {
        [keyName: string]: Validator;
    }
    interface ITrustedHtmlByValidationKey {
        [validationKey: string]: ITrustedHtml;
    }
    interface ITrustedHtmlSet {
        [dotNetName: string]: ITrustedHtmlByValidationKey;
    }
    interface IDotNetModel {
        [dotNetName: string]: any;
    }
    interface IValidatedModelController extends ng.INgModelController {
        suppressValidationMessages: boolean;
        validationMessages: ITrustedHtmlByValidationKey;
    }
    interface ScopeValidationState {
        cancelSuppress: boolean;
        showValidationSummary: boolean;
        messages: ITrustedHtmlSet;
        data: IDotNetModel;
    }
}
declare module ResponsivePath.Validation.Unobtrusive {
}
declare module ResponsivePath.Validation.Unobtrusive {
    class ValidationProvider implements ng.IServiceProvider {
        private validationTypes;
        getValidationType(validatorName: string): ValidationType;
        addValidator(validatorName: string, validate: ValidateMethod, inject?: string[]): void;
        $get($injector: ng.auto.IInjectorService): ValidationService;
        private static $inject;
        constructor();
    }
}
declare module ResponsivePath.Validation.Unobtrusive {
    interface GetSetMessageArray {
        (scope: ng.IScope): ITrustedHtmlSet;
        (scope: ng.IScope, dotNetName: string): ITrustedHtmlByValidationKey;
        (scope: ng.IScope, dotNetName: string, setMessages: ITrustedHtmlByValidationKey): ITrustedHtmlByValidationKey;
    }
    interface GetSetDotNetValue {
        (scope: ng.IScope): IDotNetModel;
        (scope: ng.IScope, dotNetName: string): any;
        (scope: ng.IScope, dotNetName: string, setModelValue: any): any;
    }
    class ValidationService {
        private $injector;
        private $sce;
        private getValidationType;
        ensureValidation(scope: ng.IScope): ScopeValidationState;
        getValidation(validationType: string): ValidationType;
        buildValidation(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModelController: IValidatedModelController): ValidationTools;
        messageArray: GetSetMessageArray;
        dataValue: GetSetDotNetValue;
        hasCancelledSuppress: (scope: ng.IScope) => boolean;
        cancelSuppress(scope: ng.IScope): void;
        clearDotNetName(scope: ng.IScope, dotNetName: string): void;
        validationSummaryVisible(scope: ng.IScope): boolean;
        validationSummaryVisible(scope: ng.IScope, value: boolean): void;
        static $inject: string[];
        constructor($injector: ng.auto.IInjectorService, $sce: IMySCEService, getValidationType: (keyName: string) => ValidationType);
    }
}
declare module ResponsivePath.Validation.Unobtrusive {
    interface ValidationParameters {
        [key: string]: string;
    }
    interface InjectedValidationValues {
        [key: string]: any;
    }
    class Validator {
        protected validationTools: ValidationTools;
        constructor(keyName: string, validate: ValidationType, message: any, attributes: ng.IAttributes, scope: ng.IScope, ngModel: IValidatedModelController, validationTools: ValidationTools, $injector: ng.auto.IInjectorService);
        name: string;
        validate: ValidateMethod;
        message: any;
        parameters: ValidationParameters;
        injected: InjectedValidationValues;
        attributes: ng.IAttributes;
        scope: ng.IScope;
        ngModel: IValidatedModelController;
        fail(message?: string): void;
        pass(): void;
    }
}
declare module ResponsivePath.Validation.Unobtrusive {
}
