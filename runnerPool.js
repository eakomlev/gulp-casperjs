'use strict';

var Runner = require('./runner');

var _max = 1;
var runners = [];
var queue = [];

function RunnerPool() {
}

RunnerPool.prototype.setMaxRunner = function (count) {
    _max = count;
};

RunnerPool.prototype.queue = function (file, options) {
    var data = {
        file: file,
        options: options,
        defer: Promise.defer()
    };

    if (runners.length == _max) {
        queue.push(data);
    } else {
        var runner = new Runner();
        runner.exec(data).then(onRunnerEnd);
        runners.push(runner);
    }

    return data.defer.promise;
};

function onRunnerEnd(result) {
    var runner = result.runner,
        item = result.data;

    item.defer.resolve();

    if (queue.length > 0) {
        runner.exec(queue.pop()).then(onRunnerEnd);
    } else {
        var index = runners.indexOf(runner);
        if (index >= 0) {
            runners.splice(index, 1);
        }
    }
}

module.exports = new RunnerPool();