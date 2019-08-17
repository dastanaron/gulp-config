var gulp        = require('gulp'),
    sass        = require('gulp-sass'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
    cssnano     = require('gulp-cssnano'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        },
        notify: false
    });
});

gulp.task('sass', function() {
    return gulp.src('app/sass/**/*.scss')
        .pipe(sass())
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('js-libs', function() {
    return gulp.src([
        //path to library example: 'app/library/jquery/dist/jquery.min.js',
    ])
    .pipe(concat('library.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});

gulp.task('js', function() {
    return gulp.src('app/js/*.js')
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('html', function() {
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({ stream: true }))
});

gulp.task('images', function() {
    return gulp.src('app/images/**/*')
        .pipe(cache(imagemin({
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('distribution/images'));
});

gulp.task('watch', function() {
    gulp.watch('app/sass/**/*.scss', gulp.series('sass'));
    gulp.watch('app/*.html', gulp.parallel('html'));
    gulp.watch('app/library/**/*.js', gulp.parallel('js-libs'));
    gulp.watch('app/js/**/*.js', gulp.parallel('js'));
});

gulp.task('default', gulp.parallel('sass', 'browser-sync', 'watch'));

gulp.task('clear-cache', function (callback) {
    return cache.clearAll();
});

gulp.task('clean', async function() {
    return del.sync('distribution');
});

gulp.task('prebuild', async function() {

    gulp.src('app/css/*.css').pipe(gulp.dest('distribution/css'));

    gulp.src('app/fonts/**/*').pipe(gulp.dest('distribution/fonts'));

    gulp.src('app/js/**/*').pipe(gulp.dest('distribution/js'));

    gulp.src('app/*.html').pipe(gulp.dest('distribution'));

});

gulp.task('build', gulp.parallel('prebuild', 'clean', 'images', 'sass', 'js'));