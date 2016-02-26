'use strict';

var gutil = require('gulp-util');
var spawn = require('child_process').spawn;

function Runner() {}

Runner.prototype.exec = function (data) {
    var runner = this;

    return new Promise(function (resolve, reject) {
        var casperChild = spawn('casperjs', getCmdOpts(data.options).concat([data.file]));

        casperChild.stdout.on('data', function (data) {
            var msg = data.toString().slice(0, -1);
            gutil.log('gulp-casper-concurrent-js' + ': ['+ data.file +']', msg);
        });

        casperChild.on('close', function (code) {
            var success = code === 0;
            if (!success) {
                gutil.error('gulp-casper-concurrent-js' + ': ['+ data.file +']', code);
            }

            resolve({
                runner: runner,
                data: data
            });
        });
    });
};

function getCmdOpts(options) {
    var opts = ['test'];
    for (var key in options.params) {
        if (options.params.hasOwnProperty(key)) {
            if (typeof options.params[key] == 'boolean' && options.params[key]) {
                opts.push('--' + key);
            } else {
                opts.push('--' + key + '=' + options.params[key]);
            }
        }
    }

    return opts;
}

module.exports = Runner;