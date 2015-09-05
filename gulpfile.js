var gulp = require('gulp');
var sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var wrap = require("gulp-wrap");

gulp.task('css', function () {
    return gulp.src('./index.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['uglify'], function() {
    gulp.watch(['**/*.js', '!js/**/*.min.js'], ['uglify']);
    gulp.watch(['**/*.scss', '../*.scss', '!node_modules/'], ['css']);
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

gulp.task('default', ['uglify', 'css', 'watch']);

