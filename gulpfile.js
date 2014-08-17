/*
|--------------------------------------------------------------------------
| Gulp defintion file
|--------------------------------------------------------------------------
*/

'use strict';

/*
|--------------------------------------------------------------------------
| Gulp includes
|--------------------------------------------------------------------------
*/
var gulp = require('gulp'),
		gulpif = require('gulp-if'),
		spritesmith = require('gulp.spritesmith'),
		mainBowerFiles = require('main-bower-files');

//Automatically load any gulp plugins
var $ = require('gulp-load-plugins')();

/*
|--------------------------------------------------------------------------
| Options
|--------------------------------------------------------------------------
*/
var DEV_PATH = './app',
	DIST_PATH = './dist';

var options = {
	// ENVIRONMENT
	ENV: 'dev',

	// JADE SOURCE
	JADE_SOURCE: DEV_PATH + '/jade/**/*.jade',
	JADE_SOURCE_PATH: DEV_PATH + '/jade',

	// HTML SOURCE
	HTML_SOURCE: DEV_PATH + '/*.html',
	HTML_SOURCE_PATH: DEV_PATH,
	HTML_DIST_SOURCE: DIST_PATH + '/*.html',

	// SASS / CSS
	BROWSERS_VERSION: 'last 4 versions',
	SASS_SOURCE: DEV_PATH + '/scss/**/*.scss',
	SASS_SOURCE_PATH: DEV_PATH + '/scss',
	SASS_DIST_PATH: DIST_PATH + '/scss',
	CSS_SOURCE_PATH: DEV_PATH + '/css',
	CSS_DIST_PATH: DIST_PATH + '/css',

	//JAVASCRIPT
	JS_SOURCE: DEV_PATH + '/js/**/*.js',
	JS_SOURCE_PATH: DEV_PATH + '/js',
	JS_PARTIALS_SOURCE: DEV_PATH + '/js/partials/*.js',
	JS_PLUGINS_SOURCE: DEV_PATH + '/js/plugins/*.js',
	JS_DIST_PATH: DIST_PATH + '/js',

	// IMAGES
	IMAGE_SOURCE: DEV_PATH + '/images/*.*',
	IMAGE_SPRITE_SOURCE: DEV_PATH + '/images/sprite/*.png',
	IMAGE_SOURCE_PATH: DEV_PATH + '/images',
	IMAGE_DIST_PATH: DIST_PATH + '/images',

	// FONTS
	FONTS_SOURCE: DEV_PATH + '/fonts/*.*',
	FONTS_DIST_PATH: DIST_PATH + '/fonts',

	// KSS STYLEGUIDE
	STYLEGUIDE_SOURCE: DEV_PATH + '/scss/styleguide/**',
	STYLEGUIDE_OVERVIEW: DEV_PATH + '/styleguide.md',
	STYLEGUIDE_DIST_PATH: DIST_PATH +'/styleguide',
	STYLEGUIDE_TEMPLATE_PATH: './styleguide-template',

	// BOOTSTRAP
	BOOTSTRAP_SOURCE: DEV_PATH + '/scss/bootstrap/**',

	// BOWER
	BOWER_COMPONENTS_SOURCE_PATH: DEV_PATH + '/bower_components',
	BOWER_COMPONENT_MODERNIZR: DEV_PATH + '/bower_components/modernizr/modernizr.js'
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/
var bowerComponents = [],
	isProduction = function () {
		return options.ENV === 'Production' ? true : false;
	};

/*
|--------------------------------------------------------------------------
| Gulp tasks
|--------------------------------------------------------------------------
*/
// sass - Dev
gulp.task('sass', function () {
	return gulp.src(options.SASS_SOURCE_PATH + '/main.scss')
		.pipe($.sass({
			style: 'nested',
			errLogToConsole: true
		}))
		.pipe($.autoprefixer(['last 4 versions', 'ie 8', 'ie 7']))
		.pipe(gulp.dest(options.CSS_SOURCE_PATH));
});

// scripts - Dev || Production
gulp.task('scripts', function () {
	gulp.src(options.JS_PARTIALS_SOURCE)
		.pipe($.concat('main.js'))
		.pipe($.jshint())
		.pipe(gulp.dest(options.JS_SOURCE_PATH))
		.pipe(gulpif(isProduction, gulp.dest(options.JS_DIST_PATH)))
		.pipe(gulpif(isProduction, $.rename({suffix: '.min'})))
		.pipe(gulpif(isProduction, $.uglify()))
		.pipe(gulpif(isProduction, gulp.dest(options.JS_DIST_PATH)));

	if (options.ENV === 'Production') {
		gulp.src(options.JS_PLUGINS_SOURCE)
			.pipe($.concat('plugins.js'))
			.pipe($.jshint())
			.pipe(gulp.dest(options.JS_DIST_PATH))
			.pipe($.rename({suffix: '.min'}))
			.pipe($.uglify())
			.pipe(gulp.dest(options.JS_DIST_PATH));
	}
});

// jade-to-html - Dev
gulp.task('jade-to-html', ['bower-files'], function () {
	return gulp.src(options.JADE_SOURCE)
		.pipe($.jade({
			pretty: true,
			data: {
				env: options.ENV,
				bower_components: bowerComponents,
				main_bower_files: mainBowerFiles()
			}
		}))
		.pipe(gulp.dest(options.HTML_SOURCE_PATH));
});

// sprite generator
gulp.task('sprite', function () {
	var spriteData = gulp.src(options.IMAGE_SOURCE_PATH + '/tosprite/*').pipe(spritesmith({
		imgName: 'image-sprite.png',
		cssName: '_image-sprite.scss',
		imgPath: '../images/sprite/image-sprite.png',
		padding: 10,
		algorithm: 'diagonal'
	}));
	spriteData.img.pipe(gulp.dest(options.IMAGE_SOURCE_PATH + '/sprite'));
	spriteData.css.pipe(gulp.dest(options.SASS_SOURCE_PATH + '/components'));
});

// kss

/*
|--------------------------------------------------------------------------
| Helper tasks
|--------------------------------------------------------------------------
*/
gulp.task('bower-files', function () {
	var bowerFiles = mainBowerFiles();
	bowerComponents = [];

	gulp.src(mainBowerFiles())
		.pipe($.tap(function (file, t) {
			bowerComponents.push(file.relative);
		}));
});

/*
|--------------------------------------------------------------------------
| Copy files
|--------------------------------------------------------------------------
*/
//Copy font files
gulp.task('fonts', function() {
    gulp.src(options.FONTS_SOURCE)
      .pipe(gulp.dest(options.FONTS_DIST_PATH));
});

// Copy bower files
gulp.task('copy-bower-files', function() {
	var bowerFiles = mainBowerFiles();
	bowerFiles.push(options.BOWER_COMPONENT_MODERNIZR);
	return gulp.src(bowerFiles)
		.pipe(gulp.dest(options.JS_DIST_PATH))
		.pipe($.rename({suffix: '.min'}))
		.pipe($.uglify())
		.pipe(gulp.dest(options.JS_DIST_PATH));
});

// styles - Production
gulp.task('styles', ['sass'], function () {
	return gulp.src(options.CSS_SOURCE_PATH + '/main.css')
		.pipe(gulp.dest(options.CSS_DIST_PATH))
		.pipe($.rename({suffix: '.min'}))
		.pipe($.minifyCss())
		.pipe(gulp.dest(options.CSS_DIST_PATH));
});

// copy html to dist - Production
gulp.task('html-to-dist', ['jade-to-html'], function () {
	return gulp.src(options.HTML_SOURCE)
		.pipe(gulp.dest(DIST_PATH))
});

// copy scss to dist - Production
gulp.task('scss-to-dist', function () {
	var filterSassDirectories = [
		options.SASS_SOURCE,
		'!' + options.BOOTSTRAP_SOURCE,
		'!' + options.STYLEGUIDE_SOURCE
	];
	return gulp.src(filterSassDirectories)
		.pipe(gulp.dest(options.SASS_DIST_PATH));
});

// copy images to dist - Production
gulp.task('images', function () {
	gulp.src(options.IMAGE_SOURCE)
		.pipe(gulp.dest(options.IMAGE_DIST_PATH));
	gulp.src(options.IMAGE_SPRITE_SOURCE)
		.pipe(gulp.dest(options.IMAGE_DIST_PATH + '/sprite'));
});

/*
|--------------------------------------------------------------------------
| Clean folders
|--------------------------------------------------------------------------
*/
// Clean dist - Production
gulp.task('clean-dist', function () {
	var toClean = [
		options.CSS_DIST_PATH,
		options.SASS_DIST_PATH,
		options.FONTS_DIST_PATH,
		options.JS_DIST_PATH,
		options.IMAGE_DIST_PATH,
		options.STYLEGUIDE_DIST_PATH,
		options.HTML_DIST_SOURCE
	];
	return gulp.src(toClean, {read: false}).pipe($.clean());
});

/*
|--------------------------------------------------------------------------
| Gulp connection and watch tasks
|--------------------------------------------------------------------------
*/
// Connect
gulp.task('connect', $.connect.server({
	root: ['app'],
	port: 9000,
	fallback: '404.html',
	open: {}
}));

// Watch
gulp.task('watch-files', ['connect'], function () {
	gulp.start('sass');
	gulp.start('scripts');
	gulp.start('jade-to-html');

	// Watch .scss
	gulp.watch(options.SASS_SOURCE, ['sass']);

	// Watch .js
	gulp.watch(options.JS_SOURCE, ['scripts']);

	// Watch .jade
	gulp.watch(options.JADE_SOURCE, ['jade-to-html']);
});

// generate app content
gulp.task('app', function() {
    gulp.start('sass');
		gulp.start('scripts');
		gulp.start('jade-to-html');
});
/*
|--------------------------------------------------------------------------
| Gulp main tasks
|--------------------------------------------------------------------------
*/
// Dev taks
gulp.task('dev', function () {
	gulp.start('watch-files');
});

// Production taks
gulp.task('prod', ['clean-dist'], function () {
	options.ENV = 'Production';
	gulp.start('styles');
	gulp.start('scss-to-dist');
	gulp.start('fonts');
	gulp.start('copy-bower-files');
	gulp.start('scripts');
	gulp.start('images');
	gulp.start('html-to-dist');
});

/*
|--------------------------------------------------------------------------
| Gulp default task
|--------------------------------------------------------------------------
*/
// Dev
gulp.task('watch', ['dev']);

// Default
gulp.task('default', ['prod']);
