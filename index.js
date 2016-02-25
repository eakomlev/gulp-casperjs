var through = require('through2');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var PluginError = gutil.PluginError;
var _ = require('underscore');

const PLUGIN_NAME = 'gulp-casper-concurrent-js';

function casper(options) {
    options = _.extend({}, {
        concurrent: 1,
        params: {
            concise: false
        }
    }, options);

    var files = [];

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
        files.push(file.path);
        this.push(file);
        cb(null, file);
    };

    var end = function (cb) {
        var casperChild = spawn('casperjs', getCmdOpts(options));
        var self = this;

        casperChild.stdout.on('data', function (data) {
            var msg = data.toString().slice(0, -1);
            gutil.log(PLUGIN_NAME + ':', msg);
        });

        casperChild.on('close', function (code) {
            var success = code === 0;
            if (!success) {
                self.emit('error', new PluginError({
                    plugin: PLUGIN_NAME,
                    message: 'code ' + code
                }));
            }
            cb();
        });
    };

    return through.obj(read, end);
}

function getCmdOpts(options) {
    var opts = ['test'];
    for (var key in options) {
        if (options.hasOwnProperty(key) && key != 'params') {
            if (typeof options[key] == 'boolean' && options[key]) {
                opts.push('--' + key);
            } else {
                opts.push('--' + key + '=' + options[key]);
            }
        }
    }

    return opts;
}

module.exports = casper;
