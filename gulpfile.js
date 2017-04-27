// gulpfile.js
var gulp = require('gulp');
var babel = require('gulp-babel');

function compile(){
  return gulp.src('src/**/*.js')
      .pipe(babel({
        presets: ['es2015', 'react', 'stage-2']
      }).on('error', function(err){
        console.error(err.message);
        console.error(err.codeFrame);
      }))
      .pipe(gulp.dest('lib'));
}

gulp.task('compile', compile);

gulp.task('default',['compile'])