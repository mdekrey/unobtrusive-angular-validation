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
}
declare module ResponsivePath.Validation.Unobtrusive {
    class ValidationTools {
        private attrs;
        private ngModelController;
        private svc;
        private formController;
        private $injector;
        private $sce;
        private getValidationType;
        showValidationSummary: boolean;
        private validationEnabled;
        private validationFor;
        private validators;
        constructor(attrs: ng.IAttributes, ngModelController: IValidatedModelController, svc: ValidationService, formController: IValidatedFormController, $injector: ng.auto.IInjectorService, $sce: IMySCEService, getValidationType: (keyName: string) => ValidationType);
        enable(): void;
        disable(): void;
        runValidations: (newValue: any) => any;
        fail: (key: string, message?: string) => void;
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
        overrideValidationMessages: ITrustedHtmlByValidationKey;
        activeErrors: {
            [errorType: string]: boolean;
        };
    }
    interface IValidatedFormController extends ng.IFormController {
        $validationState: ScopeValidationState;
    }
    interface ScopeValidationState {
        activeErrors: {
            [errorType: string]: IValidatedModelController[];
        };
    }
}
declare module ResponsivePath.Validation.Unobtrusive {
}
declare module ResponsivePath.Validation.Unobtrusive {
}
declare module ResponsivePath.Validation.Unobtrusive {
    enum ValidationTiming {
        Realtime = 0,
        OnBlur = 1,
        OnSubmit = 2,
    }
    class ValidationProvider implements ng.IServiceProvider {
        private validationTypes;
        private timing;
        private shouldSetFormSubmitted;
        private delayedValidClass;
        private delayedInvalidClass;
        getValidationType(validatorName: string): ValidationType;
        addValidator(validatorName: string, validate: ValidateMethod, inject?: string[]): void;
        $get($injector: ng.auto.IInjectorService): ValidationService;
        private static $inject;
        constructor();
        setValidationMessagingTiming(timing: ValidationTiming): void;
        setShouldSetFormSubmitted(shouldSetFormSubmitted: boolean): void;
        setValidityClasses(delayedValidClass: string, delayedInvalidClass: string): void;
    }
}
declare module ResponsivePath.Validation.Unobtrusive {
    interface GetMessageArray {
        (formController: ng.IFormController): ITrustedHtmlSet;
        (formController: ng.IFormController, modelName: string): ITrustedHtmlByValidationKey;
    }
    class ValidationService {
        private $injector;
        private $sce;
        private getValidationType;
        private validationMessagingTiming;
        private shouldSetFormSubmitted;
        private delayedValidClass;
        private delayedInvalidClass;
        ensureValidation(formController: ng.IFormController): ScopeValidationState;
        getValidation(validationType: string): ValidationType;
        buildValidation(formController: IValidatedFormController, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModelController: IValidatedModelController): ValidationTools;
        messageArray: GetMessageArray;
        activeMessageArray: GetMessageArray;
        clearModelName(formController: ng.IFormController, modelName: string): void;
        getValidationTiming(): ValidationTiming;
        getShouldSetFormSubmitted(): boolean;
        copyValidation(formController: ng.IFormController): void;
        private static getModelNames(formController);
        getDelayedValidClass(): string;
        getDelayedInvalidClass(): string;
        static $inject: string[];
        constructor($injector: ng.auto.IInjectorService, $sce: IMySCEService, getValidationType: (keyName: string) => ValidationType, validationMessagingTiming: ValidationTiming, shouldSetFormSubmitted: boolean, delayedValidClass: string, delayedInvalidClass: string);
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
        formController: IValidatedFormController;
        ngModel: IValidatedModelController;
        protected validationTools: ValidationTools;
        constructor(name: string, validate: ValidationType, attributes: ng.IAttributes, formController: IValidatedFormController, ngModel: IValidatedModelController, validationTools: ValidationTools, $injector: ng.auto.IInjectorService);
        validate: ValidateMethod;
        parameters: ValidationParameters;
        injected: InjectedValidationValues;
        fail(message?: string): void;
        pass(): void;
    }
}
declare module ResponsivePath.Validation.Unobtrusive {
}
