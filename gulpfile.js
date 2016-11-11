var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');

gulp.task('default', ['copy'], () => {
	return gulp.src("src/**/*.js")
	.pipe(babel())
	.pipe(gulp.dest('build'));
});

gulp.task('copy', ['clean'], () => {
	gulp.src(['package.json', 'yarn.lock'])
	.pipe(gulp.dest('build'));
})

gulp.task('clean', () => {
	del(['build/**/*']);
});

