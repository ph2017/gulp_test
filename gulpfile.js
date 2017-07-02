 var gulp = require('gulp');

 // 引入组件
 var minifycss = require('gulp-minify-css'), // CSS压缩
     uglify = require('gulp-uglify'), // js压缩
     concat = require('gulp-concat'), // 合并文件
     rename = require('gulp-rename'), // 重命名
     clean = require('gulp-clean'), //清空文件夹
     minhtml = require('gulp-htmlmin'), //html压缩
     jshint = require('gulp-jshint'), //js代码规范性检查
     imagemin = require('gulp-imagemin'), //图片压缩
     babel = require('gulp-babel'), //babel
     shell = require('gulp-shell'); //shell命令

 var rev = require('gulp-rev'); //添加版本号
 var revReplace = require('gulp-rev-replace'); //版本号替换
 var useref = require('gulp-useref'); //解析html资源定位
 var filter = require('gulp-filter'); //过滤数据
 var csso = require('gulp-csso'); //css优化压缩
 var gulpif = require('gulp-if');

 var browserSync = require('browser-sync').create(); //用于浏览器自动刷新

 //  requirejsOptimize = require('gulp-requirejs-optimize'); //requireJS合并js文件的插件




 gulp.task('html', function() {
     return gulp.src(['src/*.html', './*.html'])
         .pipe(minhtml({ collapseWhitespace: true }))
         .pipe(gulp.dest('dist'));
 });

 gulp.task('css', function(argument) {
     gulp.src('src/css/*.css')
         .pipe(concat('merge.css'))
         .pipe(rename({
             suffix: '.min'
         }))
         .pipe(minifycss())
         .pipe(gulp.dest('dist/css/'));
 });

 gulp.task('babel', ['requirejs'], () => {
     return gulp.src('src/**/*.js')
         .pipe(babel({
             presets: ['es2015']
         }))
         .pipe(gulp.dest('compile'));
 });

 //  gulp.task('requirejs', ['babel'], function() {
 //      return gulp.src('compile/js/main.js')
 //          .pipe(requirejsOptimize({
 //              optimize: 'none',
 //          }))
 //          .pipe(gulp.dest('compile/requirejs'));
 //  });

 gulp.task('requirejs', shell.task(['r.js -o src/js/build.js']));

 gulp.task('js', ['babel'], function(argument) {
     gulp.src('compile/js/index.merge.js')
         //  .pipe(jshint())
         //  .pipe(jshint.reporter('default'))
         .pipe(concat('index.merge.js'))
         .pipe(rename({
             suffix: '.min'
         }))
         .pipe(uglify())
         .pipe(gulp.dest('dist/js/'));
 });

 gulp.task('img', function(argument) {
     gulp.src('src/imgs/*')
         .pipe(imagemin())
         .pipe(gulp.dest('dist/imgs'));
 });

 gulp.task('clear', function() {
     gulp.src('dist/*', { read: false })
         .pipe(clean());
 });

 gulp.task("index", function() {
     var jsFilter = filter("**/*.js", { restore: true });
     var cssFilter = filter("**/*.css", { restore: true });

     //gulp-useref插件用法：https://www.npmjs.com/package/gulp-useref
     //3.x版本与2.x版本用法不兼容
     return gulp.src("index.html")
         .pipe(useref())
         .pipe(jsFilter)
         .pipe(uglify()) // 压缩js文件
         .pipe(jsFilter.restore)
         .pipe(cssFilter)
         .pipe(csso()) // 压缩css文件
         .pipe(cssFilter.restore)
         .pipe(rev()) // 给js，css文件添加版本号
         .pipe(revReplace()) // 替换index.html中的js，css文件
         .pipe(gulp.dest('dist'));
 });

 gulp.task('minifyIndex', ['index'], () => {
     return gulp.src("dist/*.html")
         .pipe(minhtml({ collapseWhitespace: true }))
         .pipe(gulp.dest('dist'))
         .pipe(rename('index.html'))
         .pipe(gulp.dest('dist'));
 })

 gulp.task('reload', function() {
     browserSync.reload();
 });

 gulp.task('server', function() {
     browserSync.init({
         server: {
             baseDir: "./src"
         }
     });

     gulp.watch(['**/*.css', '**/*.js', '**/*.html'], ['reload']);
 });

 gulp.task('build', ['js', 'minifyIndex', 'img']);