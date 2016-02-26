var through = require('through2');
var gutil = require('gulp-util');
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

        d.push(RunnerPool.queue(file, opts));
        this.push(file);
        cb(null, file);
    };

    var end = function (cb) {
        Promise.all(d).then(function () {
            cb();
        });
    };

    return through.obj(read, end);
}

module.exports = casper;
