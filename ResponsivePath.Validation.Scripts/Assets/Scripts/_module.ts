/// <reference path="construction.ts" />

module ResponsivePath.Validation.Unobtrusive {
    export var modBase: ng.IModule = angular.module('unobtrusive.validation.only', []);
    export var mod: ng.IModule = angular.module('unobtrusive.validation', [
        'unobtrusive.validation.only',
        'unobtrusive.validation.valmsgFor',
        'unobtrusive.validation.valmsgSummary',
        'unobtrusive.validation.templates',
    ]);
}