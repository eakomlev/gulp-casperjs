var through = require('through2');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var PluginError = gutil.PluginError;
var _ = require('underscore');
var RunnerPool = require('./runnerPool');

const PLUGIN_NAME = 'gulp-casper-concurrent-js';

function casper(options) {
    var opts = _.extend({}, {
        concurrent: 1,
        params: {
            concise: false
        }
    }, options);

    var d = [];

    RunnerPool.setMaxRunner(opts.concurrent);

    var read = function (file, enc, cb) {
        if (file.isNull()) {
            cb(null, file);
            return;
        }

        if (file.isStream()) {
            this.emit('error', new PluginError({
                plugin: PLUGIN_NAME,
                message: 'Streams are not supported.'
            }));

            return cb(null, file);
        }

        d.push(RunnerPool.queue(file.path, opts));
        this.push(file);
        cb(null, file);
    };

    var end = function (cb) {
        var plugin = this;

        Promise.all(d).then(function () {
            cb();
        }, function (err) {
            plugin.emit('error', new PluginError({
                plugin: PLUGIN_NAME,
                message: err.message
            }));
        });
    };

    return through.obj(read, end);
}

//RunnerPool.setMaxRunner(1);
//
//var d = [];
//
//d.push(RunnerPool.queue('file1'));
//d.push(RunnerPool.queue('file2'));
//d.push(RunnerPool.queue('file3'));
//d.push(RunnerPool.queue('file4'));
//d.push(RunnerPool.queue('file5'));
//d.push(RunnerPool.queue('file6'));
//
//Promise.all(d).then(function () {
//    console.log('end tasks');
//});
//
//setTimeout(function () {
//    console.log('end');
//}, 10000);

module.exports = casper;
