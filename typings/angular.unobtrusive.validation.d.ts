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
        private attrs;
        private ngModelController;
        private svc;
        private scope;
        private $injector;
        private $sce;
        private getValidationType;
        showValidationSummary: boolean;
        private validationEnabled;
        private validationFor;
        private validators;
        constructor(attrs: ng.IAttributes, ngModelController: IValidatedModelController, svc: ValidationService, scope: ng.IScope, $injector: ng.auto.IInjectorService, $sce: IMySCEService, getValidationType: (keyName: string) => ValidationType);
        enable(): void;
        disable(): void;
        runValidations: (newValue: any) => any;
        fail: (key: string) => void;
        pass: (key: string) => void;
        private buildValidatorsFromAttributes();
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
        [modelName: string]: ITrustedHtmlByValidationKey;
    }
    interface ICompleteModel {
        [modelName: string]: any;
    }
    interface IValidatedModelController extends ng.INgModelController {
        allValidationMessages: ITrustedHtmlByValidationKey;
    }
    interface ScopeValidationState {
        messages: ITrustedHtmlSet;
        data: ICompleteModel;
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
        (scope: ng.IScope, modelName: string): ITrustedHtmlByValidationKey;
        (scope: ng.IScope, modelName: string, setMessages: ITrustedHtmlByValidationKey): ITrustedHtmlByValidationKey;
    }
    interface GetSetModelValue {
        (scope: ng.IScope): ICompleteModel;
        (scope: ng.IScope, modelName: string): any;
        (scope: ng.IScope, modelName: string, setModelValue: any): any;
    }
    class ValidationService {
        private $injector;
        private $sce;
        private getValidationType;
        ensureValidation(scope: ng.IScope): ScopeValidationState;
        getValidation(validationType: string): ValidationType;
        buildValidation(scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModelController: IValidatedModelController): ValidationTools;
        messageArray: GetSetMessageArray;
        dataValue: GetSetModelValue;
        clearModelName(scope: ng.IScope, modelName: string): void;
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
        name: string;
        attributes: ng.IAttributes;
        scope: ng.IScope;
        ngModel: IValidatedModelController;
        protected validationTools: ValidationTools;
        constructor(name: string, validate: ValidationType, attributes: ng.IAttributes, scope: ng.IScope, ngModel: IValidatedModelController, validationTools: ValidationTools, $injector: ng.auto.IInjectorService);
        validate: ValidateMethod;
        parameters: ValidationParameters;
        injected: InjectedValidationValues;
        fail(message?: string): void;
        pass(): void;
    }
}
declare module ResponsivePath.Validation.Unobtrusive {
}
