/*
 * grunt-contrib-jst
 * http://gruntjs.com/
 *
 * Copyright (c) 2015 Tim Branyen, contributors
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jst: {
      compile: {
        options: {
          templateSettings: {
            variable: 'obj'
          },
          processName: function(filepath) {
            return filepath.replace('www/tpls/', '').replace(/\.html$/, '');
          }
        },
        files: {
          'www/app/tpls/all.js': ['www/tpls/**/*.html']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jst');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jst']);

};