'use strict';

var async = require('async');
var fs = require('fs');
var gulp = require('gulp');
var minimist = require('minimist');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var cleanCss = require('gulp-clean-css');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var replace = require('gulp-replace');
var html2js = require('gulp-html2js');
var mocha = require('gulp-mocha');
var gif = require('gulp-if');
var env = 'development';
var options = minimist(process.argv.slice(2));
var buildId = Number(String(fs.readFileSync('.build')).trim());

var css = [
    './bower_components/angular-material/angular-material.css',
    './bower_components/angular-toastr/dist/angular-toastr.css',
    './scss/main.scss'
];

var js = [
    './bower_components/socket.io-client/dist/socket.io.js',
    './bower_components/jquery/dist/jquery.js',
    './bower_components/async/dist/async.js',
    './bower_components/moment/min/moment.js',
    './bower_components/lodash/dist/lodash.js',
    './bower_components/angular/angular.js',
    './bower_components/angular-aria/angular-aria.js',
    './bower_components/angular-route/angular-route.js',
    './bower_components/angular-cookies/angular-cookies.js',
    './bower_components/angular-resource/angular-resource.js',
    './bower_components/angular-animate/angular-animate.js',
    './bower_components/angular-material/angular-material.js',
    './bower_components/angular-toastr/dist/angular-toastr.tpls.js',
    './www/build/' + buildId + '/javascripts/partial.js',
    './javascripts/config.js',
    './javascripts/app.js',
    './javascripts/directives/conversationMembers.js',
    './javascripts/directives/messagesListHeight.js',
    './javascripts/directives/userAvatar.js',
    './javascripts/filters/n2br.js',
    './javascripts/filters/html.js',
    './javascripts/factories/conversationFactory.js',
    './javascripts/factories/messageFactory.js',
    './javascripts/factories/userFactory.js',
    './javascripts/services/configService.js',
    './javascripts/services/socketService.js',
    './javascripts/services/userService.js',
    './javascripts/services/conversationService.js',
    './javascripts/services/messageService.js',
    './javascripts/controllers/mainController.js',
    './javascripts/controllers/conversationListController.js',
    './javascripts/controllers/chatController.js',
    './javascripts/controllers/userController.js'
];

var bg = [
    './partials/index.html'
];

var partial = [
    './partials/**/*.html'
];

gulp.task('partial', function() {

    return gulp.src(partial)
        .pipe(html2js('partial.js', {
            adapter: 'angular',
            base: 'templates',
            name: 'aPartial'
        }))
        .pipe(gulp.dest('./www/build/' + buildId + '/javascripts'));
});

gulp.task('html', function() {

    return gulp.src(bg)
        .pipe(replace('%env%', env))
        .pipe(replace('%build\_id%', buildId))
        .pipe(gulp.dest('./www'));
});

gulp.task('js', ['partial'], function() {

    return gulp.src(js)
        .pipe(concat('all.js'))
        .pipe(replace(/\%env\%/g, env))
        .pipe(gif(env === 'production', uglify()))
        .pipe(gulp.dest('./www/build/' + buildId + '/javascripts'));
});

gulp.task('css', function () {

    return gulp.src(css)
        .pipe(concat('all.js'))
        .pipe(sass())
        .pipe(gif(env === 'production', cleanCss({
            rebase: false
        })))
        .pipe(gulp.dest('./www/build/' + buildId + '/stylesheets'));
});

gulp.task('production', function () {

    env = 'production';

    return gulp.start('css', 'js', 'html');
});

gulp.task('default', function () {

    env = 'development';

    return gulp.start('css', 'js', 'html');
});

gulp.task('watch', function () {

    gulp.start('default');

    return watch([
        './javascripts/*',
        './javascripts/**/*',
        './views/*',
        './partials/*',
        './scss/*'
    ], function() {

        return gulp.start('default');
    });
});

gulp.task('test', function() {

    return  gulp.src('./tests/' + (options.suite ? options.suite : '*') + '.js', {read: false})
        .pipe(mocha({
            reporter: 'spec'
        }));
});