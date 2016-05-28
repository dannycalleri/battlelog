/**
 * Created by daniele on 12/01/16.
 */

// ====================================================
// Modules

var gulp        = require("gulp");
var sass        = require("gulp-ruby-sass");

// for applying pipes conditionally
var gulpIf      = require("gulp-if");
var uglify      = require("gulp-uglify");
var useref      = require("gulp-useref");
var gulpUtil    = require("gulp-util");
var browserSync = require("browser-sync").create();
var browserify  = require("browserify");
var babelify    = require("babelify");
var source      = require("vinyl-source-stream");
var request     = require("gulp-download");
var exec = require('child_process').exec;
var stream = require('stream');

// http://stackoverflow.com/questions/24992980/how-to-uglify-output-with-browserify-in-gulp
var buffer      = require("vinyl-buffer");

var reload      = browserSync.reload;
var historyApiFallback = require('connect-history-api-fallback');

// aws config object
var aws = {
    bucket: '',
    maxAge: 60,
    complete: false
};

var runSequence = require('run-sequence');
var shell = require('gulp-shell');
var config = require('./config.js');

// ====================================================

/*
    There are 2 different builds, each one in its own directory:
        * debug
        * dist

    Debug is a build for debugging that doesn't contain minified source code and logs everything to console.
    Dist is a production-ready build, with minified source code and all optimizations on.
*/

var building = false;

var paths = {
    app: "./app",
    debugBuild: "./.debug",
    distBuild: "./dist"
};

// cleans up debug and dist directories
gulp.task('clean', require('del').bind(null, [paths.debugBuild, paths.distBuild]));
gulp.task('startBuilding', function(){ building = true; });
gulp.task('default', ['clean'], function () { gulp.start('build'); });

gulp.task('build', ['startBuilding', 'build-index', 'sass', 'js', 'html', 'images', 'fonts'], function(){});

// Static Server + files watcher
gulp.task('serve', ['build-index', 'sass', 'js', 'html'], function() {

    // Serve files from both ./.debug and ./app.
    // In this way I can serve all images from ./app without copying them
    // and all the bundled JS and compiled CSS from /.debug
    browserSync.init({
        port: 1337,
        server: {
            baseDir: ['./', paths.debugBuild, paths.app]//,
            // NOTE: looks into history when loading a route
            // this is necessary to debug when using browserHistory
            //middleware: [historyApiFallback()]
        }
    });

    gulp.watch(paths.app+"/scss/**/*.scss", ['sass']);
    gulp.watch(paths.app+"/src/**/*.jsx", ['js']);
    gulp.watch(paths.app+"/**/*.html", ['html']);
    //gulp.watch(paths.app+"/*.html").on('change', browserSync.reload);
});

gulp.task('js', function(){
    // Setting debug to "true" will automatically generate source maps,
    // this way it's possible to debug individual .jsx files
    browserify(paths.app+'/src/main.jsx', building ? {} : { debug: true })
        .transform(babelify, {presets: ["es2015", "react"]})
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(buffer())
        .pipe(gulpIf(building, uglify().on('error', gulpUtil.log)))
        .pipe(gulp.dest(building ? paths.distBuild+'/src/' : paths.debugBuild+'/src/'))
        .pipe(reload({stream: true}));
});

/**
 * Compile with gulp-ruby-sass + source maps
 */
gulp.task('sass', function () {
    return sass('app/scss/main.scss', {sourcemap: true})
        .pipe(gulp.dest(building ? paths.distBuild+'/styles' : paths.debugBuild+'/styles'))
        .pipe(reload({stream: true}));
});

gulp.task('images', function () {
    return gulp.src(paths.app+'/images/**/*')
        /*.pipe($.cache($.imagemin({
         progressive: true,
         interlaced: true
         })))*/
        .pipe(gulp.dest(building ? paths.distBuild+'/images' : paths.debugBuild+'/images'));
});

gulp.task('fonts', function () {
    return gulp.src(paths.app+'/fonts/**/*')
        //.pipe($.filter('**/*.{eot,svg,ttf,woff}'))
        //.pipe($.flatten())
        .pipe(gulp.dest(building ? paths.distBuild+'/fonts' : paths.debugBuild+'/fonts'));
});

gulp.task('html', function() {
    return gulp.src('app/*.html')
            .pipe(useref())
            .pipe(gulpIf('*.js', uglify().on('error', gulpUtil.log)))
            //.pipe(gulpIf('*.css', minifyCss()))
            .pipe(gulp.dest(building ? paths.distBuild : paths.debugBuild))
            .pipe(reload({stream: true}));
});

gulp.task('s3-upload', function(){
    shell.task([
        'aws s3 sync dist ' + aws.bucket + (aws.complete ? '' : ' --exclude "*logos/*"') + ' --region "eu-west-1" --acl "public-read" --cache-control "max-age=' + aws.maxAge + '"'
    ])();
});

gulp.task('build-index', function(){
    var posts = {};
    var postsPerTags = {};

    var isBlogPost = function(str){
        return (
            str.split(' ')
               .filter(function(s){ return s == '#blog'; })
           ).length > 0;
    };

    var extractTags = function(str){
        var start = str.indexOf('[');
        var end = str.indexOf(']');

        str = str.replace(/[\[\]]/g, '');

        // if found tags
        if(start >= 0 && end >= 0 && end > start)
        {
            var tags = str.substr(start,end-start);
            tags = tags.split(',');
            return tags.map(function(t){ return t.trim(); });
        }

        return [];
    };

    var filterTitle = function(title){
        var fs = require("fs");
        var file = fs.readFileSync("./blog/stop-words.txt", "utf8");
        var stopWords = file.split('\n');

    	title = title.toLowerCase();

    	var words = title.split(' ');
    	for(var i=0; i < stopWords.length; i++)
    	{
    		for(var j=words.length-1; j >= 0; j--)
    		{
    			if(words[j].length != stopWords[i].length) continue;

    			words[j] = words[j].split(stopWords[i]).join('');
    			if(words[j] === '')
    				words.splice(j,1);
    		}
    	}

    	title = words.join('-');

    	// append an incremental number
    	// if a post with this title already exists
    	var count = 2;
    	var incrementedTitle = title;
    	while(incrementedTitle in posts)
    		incrementedTitle = title + '' + (count++);

    	title = encodeURIComponent(incrementedTitle);
    	return title;
    };

    exec('curl https://api.github.com/users/'+config.username+'/gists', function (err, stdout, stderr) {
        if(err)
        {
            cb(err);
            return;
        }

        var gists = JSON.parse(stdout);
        for(var i=0; i < gists.length; i++)
        {
            var gist = gists[i];

            if(typeof gist.description !== "undefined" &&
               gist.description !== null &&
               isBlogPost(gist.description))
            {
                var title = gist.description.substr(gist.description.indexOf(']')+1).trim();
                var slug = filterTitle(title);
                var tags = extractTags(gist.description);

                posts[slug] = {
                    id: gist.id,
                    tags: tags,
                    date: gist.updated_at,
                    url: gist.html_url,
                    title: title
                };

                // building tags index
                for(var j=0; j < tags.length; j++)
                {
                    if(typeof postsPerTags[tags[j]] === "undefined")
                        postsPerTags[tags[j]] = [];

                    postsPerTags[tags[j]].push(title);
                }
            }
        }

        var s = new stream.Readable();
        s._read = function noop() {};
        s.push(JSON.stringify(posts));
        s.push(null);

        // writing index per title
        s.pipe(source("index.json"))
         .pipe(gulp.dest('./blog'));

        s = new stream.Readable();
        s._read = function noop() {};
        s.push(JSON.stringify(postsPerTags));
        s.push(null);

        // write tags.json
        s.pipe(source("tags.json"))
         .pipe(gulp.dest('./blog'));
    });
});

gulp.task('upload-index', function(){

});

gulp.task('update-index', function(){
    runSequence('build-index', 'upload-index');
});

gulp.task('deploy', function() {
    aws.bucket = '';
    aws.maxAge = 60;
    runSequence('clean', 'build', 's3-upload');
});
