/// <reference path="https://cdnjs.cloudflare.com/ajax/libs/mocha/2.2.1/mocha.js" />
/// <reference path="blanket.js" />
// http://alex-seville.github.io/blanket/src/adapters/mocha-blanket.js
var rawCoverage;
var mapping;
var finalCoverage;
(function () {

    if(!mocha) {
        throw new Exception("mocha library does not exist in global namespace!");
    }


    /*
     * Mocha Events:
     *
     *   - `start`  execution started
     *   - `end`  execution complete
     *   - `suite`  (suite) test suite execution started
     *   - `suite end`  (suite) all tests (and sub-suites) have finished
     *   - `test`  (test) test execution started
     *   - `test end`  (test) test completed
     *   - `hook`  (hook) hook execution started
     *   - `hook end`  (hook) hook complete
     *   - `pass`  (test) test passed
     *   - `fail`  (test, err) test failed
     *
     */

    var OriginalReporter = mocha._reporter;

    var BlanketReporter = function(runner) {
            runner.on('start', function() {
                blanket.setupCoverage();
            });

            runner.on('end', function() {
                blanket.onTestsDone();
            });

            runner.on('suite', function() {
                blanket.onModuleStart();
            });

            runner.on('test', function() {
                blanket.onTestStart();
            });

            runner.on('test end', function(test) {
                blanket.onTestDone(test.parent.tests.length, test.state === 'passed');
            });

            // NOTE: this is an instance of BlanketReporter
            new OriginalReporter(runner);
        };
        
    BlanketReporter.prototype = OriginalReporter.prototype;

    mocha.reporter(BlanketReporter);

    var oldRun = mocha.run,
        oldCallback = null;

    mocha.run = function (finishCallback) {
      oldCallback = finishCallback;
    };
    blanket.beforeStartTestRunner({
        callback: function(){
            if (!blanket.options("existingRequireJS")){
                oldRun(oldCallback);
            }
            mocha.run = oldRun;
        }
    });

    blanket.options("reporter", function (coverageData) {

    	function ensureArray(inputArray, reqLength) {
    		while (inputArray.length < reqLength)
    			inputArray.push(0);
    		return inputArray;
    	}

    	SourceMapping.SourceMapLocator.Locate(Object.keys(coverageData.files)).then(function (lookups) {
    		mapping = lookups;
    		var resultFiles = {};
    		angular.forEach(coverageData.files, function (coverage, destFile) {
    			if (lookups[destFile]) {
    				angular.forEach(lookups[destFile].sources, function (source, sourceFile) {
    					resultFiles[sourceFile] = _.map(_.range(source.length+1), function () { return 0; });
    					resultFiles[sourceFile].source = source;
    					for (var i = 0; i < source.length; i++) {
    						var generatedLines = lookups[destFile].sourceLineToGeneratedLines(sourceFile, i);
    						resultFiles[sourceFile][i + 1] = _.some(_.map(generatedLines, function (lineNumber) { return coverage[lineNumber+1]; }),
								function (val) { return val || val === undefined; }) ? 1 : 0;
    					}
    				});
    			}
    			else {
    				resultFiles[destFile] = coverage;
    			}
    		});
    		rawCoverage = coverageData.files;
    		finalCoverage = resultFiles;
    		coverageData.files = resultFiles;
    		blanket.defaultReporter(coverageData);
    	});
    });
})();