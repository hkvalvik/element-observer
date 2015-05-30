var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var wrap = require("gulp-wrap");

gulp.task('watch', ['uglify'], function() {
    gulp.watch(['**/*.js', '!js/**/*.min.js'], ['uglify']);
});

gulp.task('uglify', function() {
    return gulp
        .src(['lib/**/*.js', 'index.js'])
        .pipe(concat('index.min.js'))
        .pipe(uglify({
            compress: false
        }))
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(gulp.dest(''));
});

gulp.task('default', function() {
    // place code for your default task here
});

