'use strict';

var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var path = require('path');

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

module.exports = function (task, callback) {
    var casperChild = spawn('./node_modules/casperjs/bin/casperjs', getCmdOpts(task.options).concat([task.file.path]));

    casperChild.stdout.on('data', function (message) {
        var msg = message.toString().slice(0, -1);
        gutil.log('gulp-casper' + ': [' + path.basename(task.file.path) + ']', msg);
    });

    casperChild.on('close', function (code) {
        var success = code === 0;
        if (!success) {
            gutil.log('gulp-casper' + ': [' + path.basename(task.file.path) + ']', code);
        }

        callback();
    });
};