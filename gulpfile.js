'use strict';
 
var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
 
gulp.task('default', ['browser-sync'], function () {
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
	  script: 'server_sqlite.js'
	}).on('start', function () {
      cb();
  });
});