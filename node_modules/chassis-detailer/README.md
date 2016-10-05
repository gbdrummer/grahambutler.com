# chassis-detailer

A UI component plugin system for the [Chassis Core Layout System](https://github.com/ngnjs/chassis-sass).

## Installation

`npm install chassis-detailer --save-dev`

**Usage within a gulp/grunt process:**

```js
gulp.task('sasscompile', function () {
  return gulp.src([DIR.SASS])
    .pipe(
      sass({
        includePaths: require('chassis-detailer').includePaths
      })
    ).on('error', sass.logError)
    .pipe(gulp.dest(DEST + '/stylesheets'))
})
```
