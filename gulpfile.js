/// <reference path="./typings/gulp.d.ts" />
/*jslint node: true */
'use strict';
 
var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var tsc    = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
 /*
var paths = {
    tscripts : { 
        src : [
            './server.ts',
            'models/*.ts',
            'constants/*.ts',
            'database/*.ts',
            'notifications/*.ts',
            'parsers/*.ts',
            'utils/*.ts'
        ],
        dest : './build/' 
    }
};
*/
 var paths = {
    tscripts : { 
        src : [
            '**/*.ts',
            '!node_modules/**',
            '!typings/**'
        ],
        dest : './build/' 
    }
};
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
	var called = false;
	return nodemon({
	  script: 'server.js'
	}).on('start', function () {
		if(!called) {
    		called = true;
			cb();
		}
  });
});

gulp.task('compile:typescript', function () {
    return gulp
        .src(paths.tscripts.src)
        .pipe(tsc({
			target: 'ES5',
			module: "CommonJS",
            removeComments: true,
            base: './'
        }))
        .js
        .pipe(gulp.dest(paths.tscripts.dest));
});

gulp.task('default', ['compile:typescript']);