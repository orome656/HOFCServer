/// <reference path="./typings/gulp/gulp.d.ts" />
/*jslint node: true */
'use strict';
 
var gulp = require('gulp');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var tsc    = require('gulp-typescript');
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
    },
    web : { 
        src : [
            'web/**'
        ],
        dest : './build/web/' 
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
        files: ["build/web/**/*.*"],
        browser: "google chrome",
        port: 3001,
	});
});
 
gulp.task('nodemon', ['compile:typescript', 'watch', 'copy'],function (cb) {
	var called = false;
	return nodemon({
	  script: 'build/server.js'
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

gulp.task('copy', function() {
    gulp.src(paths.web.src).pipe(gulp.dest(paths.web.dest));
});

gulp.task('watch', function() {  
    gulp.watch('**/*.ts', ['compile:typescript']);
    gulp.watch('web/**', ['copy']);
});

//gulp.task('default', ['compile:typescript']);