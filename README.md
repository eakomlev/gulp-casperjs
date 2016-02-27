# gulp-casper-concurrent-js

A [gulp](https://github.com/gulpjs/gulp) plugin for running [CasperJS](https://github.com/n1k0/casperjs) scripts

## Install

```
npm install --save-dev gulp-casper-concurrent-js
```

## Usages

Set concurrency option to run tests in parallel

```js
var casperJs = require('gulp-casper-concurrent-js');
gulp.task('test', function () {
  gulp.src('Globs of test files')
    .pipe(casperJs({
        concurrency: 2, // amount of parallel tasks (default 1)
        params: {
            //casperjs options
        }
    })); //run casperjs test
});
```
Please see CasperJS options

## LICENSE

The MIT License (MIT)
