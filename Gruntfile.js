;(function () {
    "use strict";

    module.exports = function (grunt) {

        // Project configuration.
        grunt.initConfig({

            // Metadata.
            pkg: grunt.file.readJSON("package.json"),
            banner: '/* ' +
                '<%= pkg.title || pkg.name %> - <%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> - ' +
                '*/\n',

            // Task configurations.
            clean: {
                all: ['dist', 'build'],
                dist: ['dist'],
                build: ['build']
            },
            copy: {
                options: {
                    banner: '<%= banner %>'
                },
                main: {
                    files: [
                        // includes files within path
                        {expand: true, flatten: true, src: ['src/less/grid.png'], dest: 'dist/css/', filter: 'isFile'},
                        {expand: true, flatten: true, src: ['src/less/src/icons/*'], dest: 'dist/css/icons/', filter: 'isFile'}
                    ]
                }
            },
            cssmin: {
                options: {
                    banner: '<%= banner %>'
                },
                minify: {
                    expand: true,
                    cwd: 'dist/css/',
                    src: ['**/*.css', '!*.min.css'],
                    dest: 'dist/css/',
                    ext: '.min.css'
                }
            },
            less: {
                production: {
                    options: {
                        paths: ['src/less'],
                        compress: true,
                        cleancss: true,
                        ieCompat: true
                    },
                    files: {
                        "dist/css/ie.css": ["src/less/ie.less"],
                        "dist/css/print.css": ["src/less/print.less"],
                        "dist/css/blueprint.css": ["src/less/blueprint.less"],
                        "dist/css/blueprint-responsive.css": ["src/less/blueprint-responsive.less"],
                        "dist/css/blueprint-plugins.css": ["src/less/blueprint-plugins.less"]
                    }
                },
                development: {
                    options: {
                        paths: ['src/less'],
                        ieCompat: true
                    },
                    files: {
                        "dist/css/ie.css": ["src/less/ie.less"],
                        "dist/css/print.css": ["src/less/print.less"],
                        "dist/css/blueprint.css": ["src/less/blueprint.less"],
                        "dist/css/blueprint-responsive.css": ["src/less/blueprint-responsive.less"],
                        "dist/css/blueprint-plugins.css": ["src/less/blueprint-plugins.less"]
                    }
                }
            },
            push: {
                options: {
                    files: ['package.json'],
                    updateConfigs: [],
                    releaseBranch: 'master',
                    add: true,
                    addFiles: ['*.*', 'dist/**', 'src/**', 'test/**'], // '.' for all files except ignored files in .gitignore
                    commit: true,
                    commitMessage: 'Release v%VERSION%',
                    commitFiles: ['*.*', 'dist/**', 'src/**', 'test/**'], // '-a' for all files
                    createTag: true,
                    tagName: 'v%VERSION%',
                    tagMessage: 'Version %VERSION%',
                    push: false,
                    npm: false,
                    gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
                }
            },
            jshint: {
                gruntfile: {
                    options: {
                        jshintrc: '.jshintrc'
                    },
                    src: 'Gruntfile.js'
                },
                src: {
                    options: {
                        jshintrc: '.jshintrc'
                    },
                    src: ['src/**/*.js']
                }
            },
            watch: {
                gruntfile: {
                    files: '<%= jshint.gruntfile.src %>',
                    tasks: ['jshint:gruntfile']
                },
                src: {
                    files: '<%= jshint.src.src %>',
                    tasks: ['jshint:src']
                }
            }
        });

        // These plugins provide necessary tasks.
        grunt.loadNpmTasks('grunt-contrib-clean');
        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-compress');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-contrib-cssmin');
        grunt.loadNpmTasks('grunt-push-release');
        grunt.loadNpmTasks('grunt-contrib-less');

        // Default task.
        grunt.registerTask('default', ['jshint', 'clean:all', 'less:production', 'copy', 'cssmin', 'compress']);
        grunt.registerTask('releasePatch', ['jshint', 'clean:all', 'less:production', 'uglify', 'copy', 'push:patch']);
        grunt.registerTask('releaseMinor', ['jshint', 'clean:all', 'less:production', 'uglify', 'copy', 'less', 'push:minor']);
        grunt.registerTask('releaseMajor', ['jshint', 'clean:all', 'less:production', 'uglify', 'copy', 'less', 'push:major']);

    };


})();