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
            gutil.log('gulp-casper-concurrent-js' + ':', msg);
        });

        casperChild.on('close', function (code) {
            var success = code === 0;
            if (!success) {
                reject(new Error(code));
            }

            resolve({
                runner: runner,
                data: data
            });
        });

        //console.log('start ' + data.file);
        //setTimeout(function () {
        //    console.log('end ' + data.file);
        //    resolve({
        //        runner: runner,
        //        data: data
        //    });
        //}, Math.random() * 1000);
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