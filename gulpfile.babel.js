'use strict'

import gulp from 'gulp'
import sass from 'gulp-sass'
import autoprefixer from 'gulp-autoprefixer'
import sourcemaps from 'gulp-sourcemaps'
import uglify from 'gulp-uglify'
import browserify from 'browserify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import browserSync from 'browser-sync'
import imagemin from 'gulp-imagemin'
import gutil from 'gulp-util'
import eslint from 'gulp-eslint'
const config = require('./gulp.config')()

gulp.task('sass', () => {
  return gulp.src(`${config.src}sass/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('.'))
    .on('error', gutil.log)
    .pipe(gulp.dest(`${config.dest}/css`))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('html', () => {
  gulp.src(`${config.src}**/*html`)
    .pipe(gulp.dest(`${config.dest}`))
})

gulp.task('eslint', () => {
  return gulp.src([`${config.src}/js/app.js`])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('error', gutil.log)
})

gulp.task('js', ['eslint'], () => {
  return browserify({
    entries: `${config.src}/js/app.js`
  })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(`${config.dest}js/`))
})

gulp.task('assets', () => {
  gulp.src(`${config.src}img/*`)
    .pipe(imagemin())
    .pipe(gulp.dest(`${config.dest}img/`))
})

gulp.task('serve', ['sass', 'js', 'html', 'assets'], () => {
  browserSync.init({
    server: config.dest
  })

  gulp.watch(`${config.src}sass/*.scss`, ['sass'])
  gulp.watch(`${config.src}**/*.html`, ['html'])
  gulp.watch(`${config.src}img/*`, ['assets'])
  gulp.watch(`${config.src}js/*.js`, ['js']).on('change', browserSync.reload)
  gulp.watch([`${config.src}/*.html`]).on('change', browserSync.reload)
})

gulp.task('default', ['sass', 'html', 'assets', 'js'])
