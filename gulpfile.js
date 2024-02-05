const { src, dest, watch, parallel, series } = require('gulp');
const scss = require('gulp-sass')(require('sass'));/*переводит файл scss в css*/
const concat = require('gulp-concat');/*переименовует файл из style.css  в style.min.css*/
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');/*конкатинирует т.е минимизирует, сжимает js файлы*/
const imagemin = require('gulp-imagemin');
const rename = require('gulp-rename');
const nunjucksRender = require('gulp-nunjucks-render');
const del = require('del');
const browserSync = require('browser-sync').create();/*Обновляет страницу в браузере*/


function browsersync() {
  browserSync.init({
        server: {
            baseDir: 'app/'
        },
        notify:false
    });
}

function nunjucks() {
  return src('app/*.njk')
  .pipe(nunjucksRender())
  .pipe(dest('app'))
  .pipe(browserSync.stream())
}


function styles() {
  return src('app/scss/*.scss')  
  .pipe(scss({outputStyle: 'compressed'}))/*compressed минифицирует файл css, а expanded делает красивым*/
  /*.pipe(concat()) style.min.css - это имя css файла, которое конвертируется после scss, хотя оно может быть любым*/
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'], grid:true }))
  .pipe(dest('app/css'))/*место куда сохраняет наш style.min.css (т.е в папку app, и css)*/
  .pipe(browserSync.stream())
}

function scripts() {
  return src([
    'node_modules/jquery/dist/jquery.js',
    'node_modules/slick-carousel/slick/slick.js',
    'node_modules/@fancyapps/fancybox/dist/jquery.fancybox.js',
    'node_modules/rateyo/src/jquery.rateyo.js',
    'node_modules/ion-rangeslider/js/ion.rangeSlider.js',
    'node_modules/jquery-form-styler/dist/jquery.formstyler.js',
    'app/js/main.js']) 
  .pipe(concat('main.min.js'))
  .pipe(uglify()) 
  .pipe(dest('app/js'))
  .pipe(browserSync.stream())
}

function images() {
  return src('app/images/**/*.*')
  .pipe(imagemin([
  imagemin.gifsicle({interlaced: true}),
	imagemin.mozjpeg({quality: 75, progressive: true}),
	imagemin.optipng({optimizationLevel: 5}),
	imagemin.svgo({
		plugins: [
			{ removeViewBox: true },
			{ clianupIDs: false }
		]
	})
  ]))
  .pipe(dest('dist/images'))
}

/*в этот билд мы переносим все html,
и только  style.min.css, и main.min.js*/
function build() { 
  return src ([
    'app/**/*.html',
    'app/css/*.css',
    'app/js/main.min.js',
  ], {base: 'app'}) /*base: 'app' означает, что в папке dist создадуться папки css и js в каждой из которой будет лежать соответсвующий файл style.min.css и main.min.js*/
  .pipe(dest('dist'))
}

function cleanDist() {
  return del('dist')
}


function watching() {
  watch(['app/**/*.scss'], styles);
  watch(['app/*.njk'], nunjucks);
  watch(['app/js/**/*.js', '!app/js/main.min.js'], scripts);
  watch(['app/**/*.html']).on('change', browserSync.reload);
}


exports.styles = styles;
exports.scripts = scripts;
exports.browsersync = browsersync;
exports.watching = watching;
exports.images = images;
exports.nunjucks = nunjucks;
exports.cleanDist = cleanDist;
exports.build = series(cleanDist, images, build);

exports.default = parallel(nunjucks, styles, scripts, browsersync, watching);
