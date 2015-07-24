module ResponsivePath.Validation.Unobtrusive {

    export function constructorAsInjectable<T>(targetClass: { new (...args: any[]): T; }): { (...args: any[]): T } {
        var result = (...args: any[]) => {
            var obj = Object.create(targetClass.prototype);
            targetClass.apply(obj, args);
            return obj;
        };
        result.$inject = targetClass.$inject;

        return result;
    }

}