module.exports = function (grunt) {
	require('jit-grunt')(grunt);
	grunt.initConfig({
		less: {
			development: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					'assets/admin/css/bdt-ai-generator.css': 'src/generator/less/app.less',
				}
			}
		},

		rtlcss: {
			siteRTL: {
				// task options
				options: {
					// rtlcss options
					opts: {
						clean: true
					},
					// rtlcss plugins
					plugins: [],
					// save unmodified files
					saveUnmodified: true
				},
				expand: true,
				cwd: 'assets/admin/css/',
				dest: 'assets/admin/css/',
				src: ['**/*.css', '!**/*.rtl.css'],
				ext: '.rtl.css'
			},

		},
		concat: {
			my_target: {
				files: {
					'assets/admin/js/bdt-ai-generator.min.js': ['src/generator/js/app.js'],
				}
			}
		},
		terser: {
			options: {
				mangle: false,
				compress: false,
			},
			my_target: {
				files: {
					'assets/admin/js/bdt-ai-generator.min.js': ['src/generator/js/app.js'],
				}
			}
		},

		watch: {
			styles: {
				files: ['src/generator/less/*.less'], // which files to watch
				tasks: ['less', 'rtlcss'],
				options: {
					nospawn: true
				}
			},
			scripts: {
				files: ['src/generator/js/*.js'],
				tasks: [ 'concat'],
				// tasks: [ 'terser'],
				options: {
					spawn: false,
				},
			}
		},

		buildnumber: {
			options: {
				field: 'buildnum',
			},
			files: ['package.json']
		},

	});

	grunt.loadNpmTasks('grunt-rtlcss');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-terser');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-build-number');



	if (process.env.NODE_ENV === "production") {
		grunt.registerTask('default', ['less', 'rtlcss', 'concat', 'buildnumber']);
	} else {
		grunt.registerTask('default', ['less', 'rtlcss', 'concat', 'buildnumber', 'watch']);
	}
};
