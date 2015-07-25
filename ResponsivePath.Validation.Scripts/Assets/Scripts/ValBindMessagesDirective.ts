module ResponsivePath.Validation.Unobtrusive {

    interface BindMessagesAttributes extends ng.IAttributes {
        valBindMessages: string;
    }

    export interface IBoundMessage {
        memberName: string;
        text: string;
    }

    interface ITrustedHtmlUnnamedSet {
        [modelName: string]: ITrustedHtml[];
    }

    class ValBindMessagesDirective {
        restrict: string = 'A';
        
        private static $inject = ['validation', '$parse', '$sce'];
        constructor(private validation: ValidationService, private $parse: ng.IParseService, private $sce: IMySCEService) {
        }

        link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: BindMessagesAttributes): void => {
            // TODO - messages

            /*var model = this.$parse(attrs['valBindMessages']);

            var disposeWatch = [
                scope.$watchCollection(attrs.valBindMessages, (newValue: IBoundMessage) => {
                    var validationScopeState = this.validation.ensureValidation(scope);
                    var target: ITrustedHtmlUnnamedSet = {};

                    // ultimately, this is unsafe, but this is a pure conversion...
                    // we don't use the keys for the validation type here, so it is just an array. This still gets forEach'd later, which still works.
                    validationScopeState.messages = <ITrustedHtmlSet><Object>target;

                    (<ng.IAngularStatic>angular).forEach(newValue, (entry) => {
                        target[entry.memberName] = target[entry.memberName] || [];
                        target[entry.memberName].push(this.$sce.trustAsHtml(entry.text));
                    });
                })
            ];

            element.on('$destroy', () => {
                (<ng.IAngularStatic>angular).forEach(disposeWatch, (d) => d());
            });*/
        }
        
    }

    mod.directive('valBindMessages', constructorAsInjectable(ValBindMessagesDirective));
}