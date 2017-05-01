'use strict';

import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import browserify from 'browserify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import browserSync from 'browser-sync';
import imagemin   from 'gulp-imagemin';

gulp.task('sass', ()=>{
  return gulp.src('./app/sass/**/*.scss') //indicar rutas
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)) //minificar
    .pipe(gulp.dest('./dist/css')); // destino del file
});

gulp.task('html',()=>{
	gulp.src("app/**/*html")
	.pipe(gulp.dest("dist/"))
});

gulp.task('js',()=>{
	return browserify({
		entries: './app/js/app.js'
	})
	.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/js/'));

});

gulp.task('assets',()=>{
	gulp.src("app/img/*")
	.pipe(imagemin())
	.pipe(gulp.dest("dist/img/"))
});

gulp.task('serve', ['sass','js','html','assets'], ()=>{

    browserSync.init({
        server: "./dist"
    });

    gulp.watch("app/sass/*.scss", ['sass']);
    gulp.watch("app/js/*.js", ['js']);
    gulp.watch("app/**/*.html", ['html']);
    gulp.watch("app/img/*", ['assets']);
    gulp.watch(["dist/**/*"]).on('change', browserSync.reload);
});

gulp.task('default',['sass','html','assets','js','serve']);