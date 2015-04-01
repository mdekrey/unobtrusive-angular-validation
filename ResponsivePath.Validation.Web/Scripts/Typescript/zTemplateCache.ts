module ResponsivePath.Validation.Unobtrusive {

    function defaultTemplates($templateCache: ng.ITemplateCacheService): void {
        $templateCache.put("templates/angular-unobtrusive-validation/valmsgSummary.html",
            '<div class="alert alert-error" ng-if="started" ng-show="validationSummary.length">' +
            '   <ul>' +
            '       <li data-ng-repeat="err in validationSummary" data-ng-bind-html="err"></span>' +
            '   </ul>' +
            '</div>' +
            '<div class="alert alert-error" ng-transclude ng-if="!started"></div>'
            );

        $templateCache.put("templates/angular-unobtrusive-validation/valmsgFor.html",
            '<span for="{{valmsgFor}}" data-ng-repeat="err in messages" generated="true" data-ng-bind-html="err"></span><span ng-transclude ng-if="!messages"></span>');
    }
    defaultTemplates.$inject = ['$templateCache'];

    mod.run(defaultTemplates);
}