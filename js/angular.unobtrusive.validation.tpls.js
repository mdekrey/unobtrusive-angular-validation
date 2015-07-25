var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var Templates;
            (function (Templates) {
                var ValmsgFor;
                (function (ValmsgFor) {
                    ValmsgFor.html = '<span for="{{valmsgFor}}" data-ng-repeat="err in messages" generated="true" data-ng-bind-html="err"></span><span ng-transclude ng-if="!messages"></span>';
                })(ValmsgFor = Templates.ValmsgFor || (Templates.ValmsgFor = {}));
            })(Templates = Unobtrusive.Templates || (Unobtrusive.Templates = {}));
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            var Templates;
            (function (Templates) {
                var ValmsgSummary;
                (function (ValmsgSummary) {
                    ValmsgSummary.html = '<div class="alert alert-error" ng-if="submitted" ng-show="validationSummary.length">   <ul>       <li data-ng-repeat="err in validationSummary" data-ng-bind-html="err"></li>   </ul></div><div class="alert alert-error" ng-transclude ng-if="!submitted"></div>';
                })(ValmsgSummary = Templates.ValmsgSummary || (Templates.ValmsgSummary = {}));
            })(Templates = Unobtrusive.Templates || (Unobtrusive.Templates = {}));
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
var ResponsivePath;
(function (ResponsivePath) {
    var Validation;
    (function (Validation) {
        var Unobtrusive;
        (function (Unobtrusive) {
            function defaultTemplates($templateCache) {
                $templateCache.put("templates/angular-unobtrusive-validation/valmsgSummary.html", Unobtrusive.Templates.ValmsgSummary.html);
                $templateCache.put("templates/angular-unobtrusive-validation/valmsgFor.html", Unobtrusive.Templates.ValmsgFor.html);
            }
            defaultTemplates.$inject = ['$templateCache'];
            Unobtrusive.mod.run(defaultTemplates);
        })(Unobtrusive = Validation.Unobtrusive || (Validation.Unobtrusive = {}));
    })(Validation = ResponsivePath.Validation || (ResponsivePath.Validation = {}));
})(ResponsivePath || (ResponsivePath = {}));
