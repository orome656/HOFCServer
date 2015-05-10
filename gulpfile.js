/// <reference path="./typings/gulp.d.ts" />
/*jslint node: true */
'use strict';
 
var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
 
gulp.task('default', ['browser-sync'], function () {
});
 
gulp.task('jshint', function() {
	gulp.src(['*.js','parsers/*.js','database/*.js','notifications/*.js', 'utils/*.js'])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'));
});
 
gulp.task('browser-sync', ['nodemon'], function() {
	browserSync.init(null, {
		proxy: "http://localhost:3000",
        files: ["web/**/*.*"],
        browser: "google chrome",
        port: 3001,
	});
});
 
gulp.task('nodemon', function (cb) {
	return nodemon({
	  script: 'server.js'
	}).on('start', function () {
      cb();
  });
});