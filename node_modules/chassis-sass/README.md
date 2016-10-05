# chassis-sass

## Installation

`npm install chassis-sass --save-dev`

**Usage within a gulp/grunt process:**

```js
gulp.task('sasscompile', function () {
  return gulp.src([DIR.SASS])
    .pipe(
      sass({
        includePaths: require('chassis-sass').includePaths
      })
    ).on('error', sass.logError)
    .pipe(gulp.dest(DEST + '/stylesheets'))
})
```
