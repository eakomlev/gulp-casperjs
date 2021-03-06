var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var extend = require('util')._extend;
var async = require('async');
var worker = require('./worker');
var phantomjs = require('phantomjs-prebuilt');
var Promise = require('bluebird');

const PLUGIN_NAME = 'gulp-casper-concurrent-js';

function casper(options) {
    var opts = extend({
        concurrency: 1,
        params: {
            concise: false
        }
    }, options);

    process.env.PHANTOMJS_EXECUTABLE = phantomjs.path;

    var queue = async.queue(worker, opts.concurrency),
        promise = new Promise(function (resolve, reject) {
            queue.drain = function () {
                resolve();
            };
        });

    return through.obj(function (file, enc, cb) {
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

        queue.push({file: file, options: opts});
        this.push(file);
        cb(null, file);
    }, function (cb) {
        promise.then(function () {
            cb();
        });
    });
}

module.exports = casper;
