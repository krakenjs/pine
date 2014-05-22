'use strict';

var util = require('util');
var slice = Array.prototype.slice.call.bind(Array.prototype.slice);


var proto = {

    log: function log(level, message) {
        var args;

        args = slice(arguments, 2);
        args.unshift(util.format('[%d:%s] %s', process.pid, this.name, message));
        args.unshift(level);

        this._impl.log.apply(this._impl, args);
        return this;
    }

};

module.exports = function createLogger(name, impl) {
    var logger;

    logger = Object.create(proto);

    Object.keys(impl.levels).forEach(function (level) {
        logger[level] = function () {
            var args;
            args = slice(arguments);
            args.unshift(level);
            return this.log.apply(this, args);
        }
    });

    return Object.create(logger, {

        name: {
            value: name,
            enumerable: true,
            writable: false
        },

        _impl: {
            value: impl,
            enumerable: false,
            writable: false,
            configurable: false
        }

    });

};