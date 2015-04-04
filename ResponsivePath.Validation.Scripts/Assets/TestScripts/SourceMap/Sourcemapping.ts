module SourceMapping {
	var sourceMapComment = '//# sourceMappingURL=';
	var injector: angular.auto.IInjectorService = angular.injector(['ng']);
	var $http: angular.IHttpService = injector.get('$http');
	var $q: angular.IQService = injector.get('$q');

	export interface ISourceMap {
		version: number; // Which version of the source map spec this map is followiangular.
		sources: string; // An array of URLs to the original source files.
		names: string; // An array of identifiers which can be referrenced by individual mappings.
		sourceRoot?: string; // Optional.The URL root from which all sources are relative.
		sourcesContent?: string[]; // Optional.An array of contents of the original source files.
		mappings: string; // A string of base64 VLQs which contain the actual mappings.
		file?: string; //Optional.The generated filename this source map is associated with.
	}

	export interface SourceMapLookup {
		[filename: string]: SourceMap
	}

	interface ISourceMapLookup {
		[filename: string]: ISourceMap
	}

	interface FilePosition {
		line: number; // 0-based
		column: number;
	}

	interface PositionWithFile extends FilePosition {
		filename: string;
	}

	function loadSourceMap(sourceFile: string): angular.IPromise<ISourceMap> {
		var deferred: angular.IDeferred<ISourceMap> = $q.defer();
		$http.get(sourceFile).success(function (contents: string) {
			var fileContents = contents.split('\n');
			var lastLine = fileContents[fileContents.length - 1];
			if (lastLine.substring(0, sourceMapComment.length) == sourceMapComment) {
				var filePath = lastLine.substring(sourceMapComment.length);
				$http.get(filePath).success(function (sourceMap: ISourceMap) {
					deferred.resolve(sourceMap);
				}).error(() => deferred.reject());
			}
			else {
				deferred.reject();
			}
		}).error(() => deferred.reject());

		return deferred.promise;
	}

	function loadAvailableMaps(files: string[]): angular.IPromise<ISourceMapLookup> {
		var counter = 0;
		var deferLoadMaps: angular.IDeferred<ISourceMapLookup> = $q.defer();
		var result: ISourceMapLookup = {};
		angular.forEach(files, function (sourceFile) {
			counter--;
			loadSourceMap(sourceFile).then(function (sourceMap) {
				counter++;
				result[sourceFile] = sourceMap;
				if (counter == 0)
					deferLoadMaps.resolve(result);
			}, function () {
				counter++;
				if (counter == 0)
					deferLoadMaps.resolve(result);
			});
		});
		return deferLoadMaps.promise;
	}

	function base64byte(str): number {
		var values = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
		return values.indexOf(str);
	}

	function parseVLQ(vlq: string): number[]{
		var result: number[] = [];
		for (var i = 0; i < vlq.length; ) {
			var value = 0;
			var factor = 1;
			do {
				var byte = base64byte(vlq[i]);
				value += (byte&31) * factor;
				factor *= 32;
				i++;
			} while ((byte & 32) == 32);
			if (value & 1) {
				value = -(value >> 1);
			}
			else {
				value = value >> 1;
			}
			result.push(value);
		}
		return result;
	}
	
	export class SourceMap {
		private input: ISourceMap;
		private processed: angular.IDeferred<void> = $q.defer<void>();
		private coveredBy: { [sourceFilename: string]: number[][] } = {};
		private covers: { [generatedLine: number]: { filename: string; line: number; }[] } = {};
		private sources: { [sourceFilename: string]: string[] } = {};

		constructor(input: ISourceMap) {
			this.input = input;
			this.process();
		}

		prepare(): angular.IPromise<void> {
			return this.processed.promise;
		}

		generatedLineToCovered(generatedLine: number): { filename: string; line: number; }[] {
			return this.covers[generatedLine];
		}

		sourceLineToGeneratedLines(sourceFilename: string, sourceLine: number): number[] {
			return this.coveredBy[sourceFilename][sourceLine];
		}

		getSource(sourceFilename: string): string[]{
			return this.sources[sourceFilename];
		}


		private process() {
			var lines = this.input.mappings.split(';');
			var source: PositionWithFile = { filename: null, line: null, column: null };
			var sourceFileIndex = null;
			var nameIndex = null;
			var sourceMappings: { [sourceFilename: string]: { sourceColumn: number; generatedLine: number; generatedColumn: number; }[][] } = {};

			for (var lineNumber = 0; lineNumber < lines.length; lineNumber++) {
				var filePosition: FilePosition = { line: lineNumber, column: 0 };
				var segments = lines[lineNumber].split(',');
				for (var segmentIndex = 0; segmentIndex < segments.length; segmentIndex++) {
					var name: string;
					var values = parseVLQ(segments[segmentIndex]);
					if (segmentIndex == 0)
						filePosition.column = values[0];
					else
						filePosition.column += values[0];

					if (values.length > 1) {
						sourceFileIndex = (sourceFileIndex === null ? values[1] : sourceFileIndex + values[1]);
						source.filename = this.input.sources[sourceFileIndex];
						source.line = (source.line === null ? values[2] : source.line + values[2]);
						source.column = (source.column === null ? values[3] : source.column + values[3]);
						name = null;
						sourceMappings[source.filename] = sourceMappings[source.filename] || [];
						sourceMappings[source.filename][source.line] = sourceMappings[source.filename][source.line] || [];
						sourceMappings[source.filename][source.line].push({
							sourceColumn: source.column,
							generatedLine: filePosition.line,
							generatedColumn: filePosition.column
						});
						this.covers[filePosition.line] = this.covers[filePosition.line] || [];
						var result = { filename: source.filename, line: source.line };
						if (!_.find(this.covers[filePosition.line], result))
							this.covers[filePosition.line].push(result);
					}
					if (values.length == 5) {
						nameIndex = (nameIndex === null ? values[4] : nameIndex + values[4]);
						name = this.input.names[nameIndex];
					}
				}
			}

			var count = -Object.keys(sourceMappings).length;
			angular.forEach(sourceMappings, (lines, sourceFile) => {
				this.coveredBy[sourceFile] = this.coveredBy[sourceFile] || [];
				loadSourceFile(sourceFile, this.sources).then(() => {
					for (var line = 0; line < this.sources[sourceFile].length; line++) {
						if (sourceMappings[sourceFile][line]) {
							sourceMappings[sourceFile][line] = (<any>_).sortByAll(sourceMappings[sourceFile][line], ['sourceColumn', 'generatedLine']);
							//var temp = _(sourceMappings[sourceFile][line]).groupBy('sourceColumn');
							//sourceMappings[sourceFile][line] = <any>temp.map((e: any) => _.first(e)).value();
						}
						else {
							var prev: { sourceColumn: number; generatedLine: number; generatedColumn: number; };
							if (line == 0) {
								prev = { sourceColumn: 0, generatedLine: 0, generatedColumn: 0 };
							} else {
								var previous = sourceMappings[sourceFile][line - 1];
								prev = angular.fromJson(angular.toJson(previous[previous.length - 1]));
								prev.sourceColumn = 0;
							}
							sourceMappings[sourceFile][line] = [prev];
						}
						this.coveredBy[sourceFile][line] = _.unique(_.pluck(sourceMappings[sourceFile][line], 'generatedLine'));
					}

					count++;
					if (count == 0) {
						this.processed.resolve();
					}
				});
			});
		}
	}

	function loadSourceFile(sourceFile: string, sources) {
		return $http.get(sourceFile).success((content: string) => {
			sources[sourceFile] = content.trim().split('\n');
		});
	}

	export class SourceMapLocator {
		static Locate(files: string[]): angular.IPromise<SourceMapLookup> {
			var deferResult = $q.defer<SourceMapLookup>();

			loadAvailableMaps(files).then((lookup) => {
				var result: SourceMapLookup = {};

				var count: number = 0;

				angular.forEach(lookup, function (iSourceMap, fileName) {
					count--;
					result[fileName] = new SourceMap(iSourceMap);
				});

				angular.forEach(result, function (sourceMap, fileName) {
					sourceMap.prepare().finally(() => {
						count++;
						if (count == 0)
							deferResult.resolve(result);
					});
				});

				return result;
			});

			return deferResult.promise;
		}
	}

	describe('Unit: SourceMap', function () {
		it('can load',(done: MochaDone) => {
			// arrange
			var target = 'tests.js';

			// act
			loadAvailableMaps([target]).then((sourceMaps) => {
				expect(sourceMaps).to.have.key(target);
			}).finally(done);
		});

		describe('on tests.js',() => {
			var sourceMap: ISourceMap;
			var util: SourceMap;
			before((done: MochaDone) => {
				// arrange
				var target = 'tests.js';

				// act
				loadAvailableMaps([target]).then((sourceMaps) => {
					sourceMap = sourceMaps['tests.js'];
					util = new SourceMap(sourceMap);
					util.prepare().finally(done);
				});
			});

			it('references Sourcemapping.ts',() => {
				expect(sourceMap.sources).to.contain('../../Assets/TestScripts/SourceMap/Sourcemapping.ts');
			});


		});
	});
}
