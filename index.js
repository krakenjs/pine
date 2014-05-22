'use strict';

var _ = require('lodash-node');
var path = require('path');
var caller = require('caller');
var winston = require('winston');
var logger = require('./lib/logger');
var common = require('./lib/common');


var DEFAULT_LOGGER, DEFAULTS, SETTINGS;

DEFAULTS = SETTINGS = {

    basedir: process.cwd(),

    levels: winston.config.npm.levels,

    colors: winston.config.npm.colors,

    transports: {
        console: {
            level: 'debug',
            timestamp: common.formatDate
        }
    },

    exceptions: {}

};


function createInstance(settings) {

    function createTransport(name) {
        var ctor, options;

        ctor = name[0].toUpperCase() + name.slice(1);
        options = settings.transports[name];
        options.timestamp = options.timestamp || common.formatDate;

        return new winston.transports[ctor](options);
    }

    return new winston.Logger({
        levels: settings.levels,
        colors: settings.colors,
        transports: Object.keys(settings.transports).map(createTransport),
        exceptionHandlers: Object.keys(settings.exceptions).map(createTransport),
        exitOnError: false
    });
}


function pine(name, options) {
    if (typeof name === 'object') {
        options = name;
        name = undefined;
    }

    name = name || caller();
    name = (name === path.resolve(name)) ? path.relative(SETTINGS.basedir, name) : name;
    options = options && _.defaults(options, SETTINGS.transports);

    // Custom options result in a new logger, otherwise reuse default.
    return logger(name, options ? createInstance(name, options) : DEFAULT_LOGGER);
}


Object.defineProperty(pine, 'configure', {
    value: function configure(options) {
        options.basedir = options.basedir ? path.resolve(options.basedir) : path.dirname(caller());
        options = _.defaults(options, DEFAULTS);

        SETTINGS = Object.freeze(options);
        DEFAULT_LOGGER = createInstance(SETTINGS);
    },
    enumerable: true,
    writable: false
});


Object.defineProperty(pine, 'settings', {
    get: function getSettings() {
        return SETTINGS;
    },
    enumerable: true
});


module.exports = pine;

