var gulp = require('gulp'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	browserify = require('browserify'),
	source = require('vinyl-source-stream'),
	buffer = require('vinyl-buffer'),
	browserSync = require('browser-sync').create(),
	imagemin   = require('gulp-imagemin');

gulp.task('sass', function () {
  return gulp.src('./app/sass/**/*.scss') //indicar rutas
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) //minificar
    .pipe(gulp.dest('./dist/css')); // destino del file
});

gulp.task('html', function(){
	gulp.src("app/*html")
	.pipe(gulp.dest("dist/"))
});

gulp.task('js',function(){
	return browserify({
		entries: './app/js/app.js'
	})
	.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'));

});

gulp.task('assets', function(){
	gulp.src("app/img/*")
	.pipe(imagemin())
	.pipe(gulp.dest("dist/img/"))
});

gulp.task('serve', ['sass','js','html','assets'], function() {

    browserSync.init({
        server: "./dist"
    });

    gulp.watch("app/sass/*.scss", ['sass']);
    gulp.watch("app/js/*.js", ['js']);
    gulp.watch("app/*.html", ['html']);
    gulp.watch("app/img/*", ['assets']);
    gulp.watch(["app/*/*", "app/*"]).on('change', browserSync.reload);
});

gulp.task('default',['sass','html','assets','js','serve']);