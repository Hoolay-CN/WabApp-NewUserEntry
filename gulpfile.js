// start
var gulp = require('gulp')
    , clean = require('gulp-clean')


// clean assets
gulp.task('base-clean', function(){
    gulp.src('assets/*.*')
        .pipe(clean())
})

// base lib
gulp.task('base', [ 'base-clean' ], function(callback){
    gulp.src([
        'node_modules/framework7/dist/**/*.*'
    ])
        .pipe(gulp.dest('./assets'))

    // jquery
    gulp.src([
        'node_modules/jquery/dist/*.js',
        'node_modules/avalonjs/dist/avalon.mobile.shim.js',
        'node_modules/tb-webuploader/dist/webuploader.html5only.min.js'
    ])
        .pipe(gulp.dest('./assets/js/'))
})
