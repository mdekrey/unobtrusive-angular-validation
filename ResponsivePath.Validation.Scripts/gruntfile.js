/// <binding AfterBuild='afterBuild' ProjectOpened='default' />
module.exports = function (grunt) {
	grunt.initConfig({
		uglify: {
			scripts: {
				files: { 'wwwroot/Scripts/angular.unobtrusive.validation.min.js': ['wwwroot/Scripts/angular.unobtrusive.validation.js'] },
				options: {
					sourceMap: true,
					sourceMapIn: 'wwwroot/Scripts/angular.unobtrusive.validation.js.map'
				}
			},
			templates: {
				files: { 'wwwroot/Scripts/angular.unobtrusive.validation.tpls.min.js': ['wwwroot/Scripts/angular.unobtrusive.validation.tpls.js'] },
				options: {
					sourceMap: false
				}
			},
		},

		clean: {
			tsCleanup: ["*.tmp.txt"],
			dedupe: ["wwwroot/Scripts/*.ts"]
		},


		copy: {
			tests: {
				files: [
					{ expand: true, cwd: 'Assets/Content/', src: ['**/*.html', '**/*.js'], dest: 'wwwroot/', filter: 'isFile' }
				]
			},
			dedupe: {
				files: [
					{ expand: true, cwd: 'wwwroot/Scripts/', src: ['**/angular.unobtrusive.validation*'], dest: '../artifacts/ts', filter: 'isFile' }
				]
			},
			prepareExports: {
				files: [
					{ expand: true, cwd: '../artifacts/ts', src: ['*.js'], dest: '../js', filter: 'isFile' },
					{ expand: true, cwd: '../artifacts/ts', src: ['*.d.ts'], dest: '../typings', filter: 'isFile' }
				]
			}
		},

		ts: {
			base: {
				src: ["Assets/typings/**/*.d.ts", 'Assets/Scripts/**/_module.ts', 'Assets/Scripts/**/*.ts', '!Assets/Scripts/**/*.d.ts'],
				out: 'wwwroot/Scripts/angular.unobtrusive.validation.js',
				options: {
					fast: 'never',
					sourceMap: true,
					target: 'es5',
					declaration: true,
				}
			},
			templates1: {
				html: ["Assets/Templates/**/Html/*.html"],
				src: [],
				options: {
					htmlModuleTemplate: 'ResponsivePath.Validation.Unobtrusive.Templates.<%= filename %>',
					fast: 'never',
					compile: false,
					sourceMap: false
				}
			},
			templates2: {
				src: ["Assets/typings/**/*.d.ts", "../artifacts/ts/angular.unobtrusive.validation.d.ts", "Assets/Templates/**/*.ts"],
				out: 'wwwroot/Scripts/angular.unobtrusive.validation.tpls.js',
				options: {
					fast: 'never',
					compile: true,
					sourceMap: false
				}
			},
			tests: {
				src: ["Assets/typings/**/*.d.ts", "../artifacts/ts/angular.unobtrusive.validation.d.ts", 'Assets/TestScripts/**/_module.ts', 'Assets/TestScripts/**/*.ts'],
				out: 'wwwroot/Scripts/tests.js',
				options: {
					fast: 'never',
					sourceMap: true,
					target: 'es5'
				}
			}
		},

		watch: {
			typescriptsBase: {
				files: ['Assets/Scripts/**/*.ts'],
				tasks: ['packageTypescripts:base']
			},
			typescriptsTemplates: {
				files: ['Assets/Templates/**/*.ts', 'Assets/Templates/**/*.html', '!Assets/Templates/**/Html/*.ts'],
				tasks: ['packageTypescripts:templates']
			},
			typescriptsTests: {
				files: ['Assets/TestScripts/**/*.ts'],
				tasks: ['packageTypescripts:tests']
			},
			testsCopy: {
				files: ['Assets/Content/**/*.html', 'Assets/Content/**/*.js'],
				tasks: ['copy:tests']
			}
		}
	});

	grunt.registerTask("packageTypescripts:base", ['ts:base', 'uglify:scripts', 'copy:dedupe', 'clean:dedupe', 'clean:tsCleanup', 'copy:prepareExports']);
	grunt.registerTask("packageTypescripts:templates", ['ts:templates1', 'ts:templates2', 'uglify:templates', 'copy:dedupe', 'clean:tsCleanup', 'copy:prepareExports']);
	grunt.registerTask("packageTypescripts:tests", ['ts:tests']);
	grunt.registerTask("buildTypescripts", ['packageTypescripts:base', 'packageTypescripts:tests']);
	grunt.registerTask("default", ['watch']);
	grunt.registerTask("afterBuild", ["buildTypescripts", "copy:tests"]);

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks("grunt-ts");
};