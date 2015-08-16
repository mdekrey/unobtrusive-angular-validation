module ResponsivePath.Validation.Unobtrusive {

    function defaultTemplates($templateCache: ng.ITemplateCacheService): void {
        $templateCache.put("templates/angular-unobtrusive-validation/valmsgSummary.html", Templates.ValmsgSummary.html);

        $templateCache.put("templates/angular-unobtrusive-validation/valmsgFor.html", Templates.ValmsgFor.html);
    }
    defaultTemplates.$inject = ['$templateCache'];

    angular.module('unobtrusive.validation.templates', [modBase.name]).run(defaultTemplates);
}