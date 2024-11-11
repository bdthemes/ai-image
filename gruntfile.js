module.exports = function (grunt) {
	grunt.initConfig({
		copy: {
			assets: {
				files: [
					{
						expand: true,
						cwd: "src/app/vendor/",
						src: "**",
						dest: "assets/vendor/",
					},
					{
						expand: true,
						cwd: "src/imgs/",
						src: "**",
						dest: "assets/imgs/",
					},
				],
			},
		},
		rtlcss: {
			siteRTL: {
				options: {
					opts: {
						clean: true
					},
					plugins: [],
					saveUnmodified: true
				},
				expand: true,
				cwd: 'assets/css/',
				dest: 'assets/css/',
				src: ['**/*.css', '!**/*.rtl.css'],
				ext: '.rtl.css'
			},
		},
		watch: {
			styles: {
				files: ['src/app/less/**/*.less'],
				tasks: ['less', 'rtlcss'],
				options: {
					nospawn: true
				}
			},
			js: {
				files: ['src/app/js/**/*.js'],
				tasks: ['concat'],
				options: {
					spawn: false,
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-rtlcss');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-terser');
	grunt.loadNpmTasks("grunt-contrib-watch");

	if (process.env.NODE_ENV === 'production') {
		grunt.registerTask('default', ['copy', 'rtlcss']);
	} else {
		grunt.registerTask('default', ['copy', 'rtlcss', 'watch']);
	}
};
