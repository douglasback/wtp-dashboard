/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;*/',
    // Task configuration.
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      lib: {
        options: {
            preserveComments: true,
            banner: ''
        },
        src: 'public/js/vendor/*.js',
        dest: 'public/js/lib/<%= pkg.slug %>.min.js'
      },
      app: {
        src: 'public/js/search.js',
        dest: 'public/js/search.min.js'
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        unused: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true,
          _: true
        }
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      search: {
        src: ['public/js/*.js']
      }
    },
    sass: {
        dev: {
            options: {
                style: "expanded",
                compass: true
            
            },
            files: [
                { 
                    src: 'public/scss/styles.scss',
                    dest: 'public/css/styles.dev.css' 
                }                
            ]
        },
        dist: {
            options: {
                style: "compressed",
                compass: true
            
            },
            files: [
                { 
                    src: 'public/scss/styles.scss',
                    dest: 'public/css/styles.css' 
                }
            ]
        }
    },
    watch: {
        js: {
            files: ['public/js/*.js', '!public/js/*.min.js'],
            tasks: ['jshint:search', 'uglify']
        },
        sass: {
            files: ['public/scss/*.scss'],
            tasks: ['sass:dev']
        }
    },
    bower: {
      dev: {
        dest: 'public/js/lib'
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower');

  // Default task.
  grunt.registerTask('default', ['jshint', 'bower', 'sass']);
};
