//// start
var gulp = require('gulp')
    , clean = require('gulp-clean')
    , webpackConfig = require('./webpack.config.js')
    , gutil = require('gulp-util')
    , webpack = require('webpack')
    , concat = require('gulp-concat')
    , minifyCSS = require('gulp-minify-css')
    , rev = require('gulp-rev')
    , revReplace = require("gulp-rev-replace")
    , fs = require('fs')
    , rename = require('gulp-rename')
    , uglify = require('gulp-uglify')
    
// clean assets
gulp.task('base-clean', function(){
    return gulp.src([ 'assets/*', 'dist/*' ])
               .pipe(clean())
})

// base lib
gulp.task('base-assets', [ 'base-clean' ], function(callback){
    // framework7
    gulp.src([
        'node_modules/framework7/dist/**/*.js',
        'node_modules/framework7/dist/**/*.css',
        //'node_modules/framework7-plus/**/*.js',
        //'node_modules/framework7-plus/**/*.css',
        //'node_modules/framework7-plus/**/*.png'
    ])
        .pipe(gulp.dest('./assets'))
        .on('end', function(){
            gulp.src([
                'node_modules/jquery/dist/*.js',
                'node_modules/avalonjs/dist/avalon.*.shim.js',
                'node_modules/tb-webuploader/dist/webuploader.html5only.min.js'
            ])
            .pipe(gulp.dest('./assets/js/'))
            .on('end', function(){
                // callback 
                callback()
            }) 
        })

})

// base build
gulp.task('base-build', ['base-assets'], function(callback){
    // js
    gulp.src([
        './assets/js/avalon.modern.shim.js',
        './assets/js/framework7.min.js',
        './assets/js/jquery.min.js',
        './assets/js/webuploader.html5only.min.js'
    ], { base : 'js/' }) 
    .pipe(concat('base.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
    .on('end', function(){
        // css
        gulp.src([
             './assets/css/framework7.ios.css',
             './src/style.css'
        ])
            .pipe(minifyCSS())
            .pipe(concat('bundle.css'))
            .pipe(gulp.dest('./dist/'))
            .on('end', function(){
                // callback
                callback()
            })
    })    
})

// app build by webpack
gulp.task('app-build', function(callback){

	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
        
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.optimize.UglifyJsPlugin({
                compress : {
                    warnings : false
                }
        })
	)

	// run webpack
	webpack(myConfig, function(err, stats) {
		if(err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
			colors: true
		}))
        // callback
        callback()
	})
})

// global build
gulp.task('build', ['base-build', 'app-build'], function(){
        
    // app scripts
    var file = fs.readFileSync('./assets/bundle.js')
    
    if( file ) {
        fs.writeFileSync('./dist/bundle.js', file)
    }
    
    //reversion
    gulp.src([
        './dist/*.js',
        './dist/*.css'
    ])    
        .pipe(rev())
        .pipe(gulp.dest('./dist/'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./'))
        .on('end', function(){
            // static files
            gulp.src(['./src/pages/**/*', './src/public/**/*'], { base : 'src' })
                .pipe(gulp.dest('./dist'))
            gulp.src(['./assets/img/**/*'], { base : 'assets' })
                .pipe(gulp.dest('./dist'))
            // rev html
            var manifest = gulp.src('./rev-manifest.json')

            gulp.src('./src/index.dist.html')
                .pipe(revReplace( {manifest:manifest} ))
                .pipe(rename('index.html'))
                .pipe(gulp.dest('./dist/'))
        })
})
