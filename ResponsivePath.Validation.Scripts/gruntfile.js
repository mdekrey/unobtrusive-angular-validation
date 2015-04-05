/// <binding AfterBuild='afterBuild' ProjectOpened='default' />
module.exports = function (grunt) {
	grunt.initConfig({
		uglify: {
			scripts: {
				files: { '../js/angular.unobtrusive.validation.min.js': ['../js/angular.unobtrusive.validation.js'] },
				options: {
					sourceMap: true,
				}
			},
			templates: {
				files: { '../js/angular.unobtrusive.validation.tpls.min.js': ['../js/angular.unobtrusive.validation.tpls.js'] },
				options: {
					sourceMap: true,
				}
			},
		},

		clean: {
			tsCleanup: ["*.tmp.txt"],
			release: { src: ["../js/*.ts"], options: { force: true } }
		},


		copy: {
			tests: {
				files: [
					{ expand: true, cwd: 'Assets/Content/', src: ['**/*.html', '**/*.js'], dest: 'wwwroot/', filter: 'isFile' }
				]
			},
			release: {
				files: [
					{ expand: true, cwd: '../js/', src: ['**/*.ts'], dest: '../typings/', filter: 'isFile' }
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
					declaration: false,
				}
			},
			base_release: {
				src: ["Assets/typings/**/*.d.ts", 'Assets/Scripts/**/_module.ts', 'Assets/Scripts/**/*.ts', '!Assets/Scripts/**/*.d.ts'],
				out: '../js/angular.unobtrusive.validation.js',
				options: {
					fast: 'never',
					sourceMap: false,
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
				src: ["Assets/typings/**/*.d.ts", "../typings/angular.unobtrusive.validation.d.ts", "Assets/Templates/**/*.ts"],
				out: 'wwwroot/Scripts/angular.unobtrusive.validation.tpls.js',
				options: {
					fast: 'never',
					compile: true,
					sourceMap: false
				}
			},
			templates2_release: {
				src: ["Assets/typings/**/*.d.ts", "../typings/angular.unobtrusive.validation.d.ts", "Assets/Templates/**/*.ts"],
				out: '../js/angular.unobtrusive.validation.tpls.js',
				options: {
					fast: 'never',
					compile: true,
					sourceMap: false
				}
			},
			tests: {
				src: ["Assets/typings/**/*.d.ts", "../typings/angular.unobtrusive.validation.d.ts", 'Assets/TestScripts/**/_module.ts', 'Assets/TestScripts/**/*.ts'],
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

	grunt.registerTask("packageTypescripts:base", ['ts:base', 'ts:base_release', 'uglify:scripts', 'clean:tsCleanup', 'copy:release', 'clean:release']);
	grunt.registerTask("packageTypescripts:templates", ['ts:templates1', 'ts:templates2', 'ts:templates2_release', 'uglify:templates', 'clean:tsCleanup']);
	grunt.registerTask("packageTypescripts:tests", ['ts:tests']);
	grunt.registerTask("buildTypescripts", ['packageTypescripts:base', 'packageTypescripts:templates', 'packageTypescripts:tests']);
	grunt.registerTask("default", ['watch']);
	grunt.registerTask("afterBuild", ["buildTypescripts", "copy:tests"]);

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks("grunt-ts");
};