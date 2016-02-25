# gulp-casperjs

A [gulp](https://github.com/gulpjs/gulp) plugin for running [CasperJS](https://github.com/n1k0/casperjs) scripts

## Install

```
npm install --save-dev gulp-casper-concurrent-js
```

## Usages

```js
var casperJs = require('gulp-casper-concurrent-js');
gulp.task('test', function () {
  gulp.src('Globs of test files')
    .pipe(casperJs()); //run casperjs test
});
```
To change the command (default: `test`) use parameter `command`:
```js
var casperJs = require('gulp-casper-concurrent-js');
gulp.task('casperCmd', function () {
  gulp.src('test.js')
    .pipe(casperJs({command:''})); //run casperjs test.js
});
```
Command can be `array` or `string`.
If command has value which cast to `false`, this parameter will be ignored.

To hide output from CasperJS use parameter `outputLog`:
```js
var casperJs = require('gulp-casper-concurrent-js');
gulp.task('casperCmd', function () {
  gulp.src('test.js')
    .pipe(casperJs({outputLog: false})); //CasperJS output not show
});
```
Default value is `true`
## LICENSE

The MIT License (MIT)
