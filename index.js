'use strict';

var _ = require('lodash-node');
var path = require('path');
var caller = require('caller');
var winston = require('winston');
var logger = require('./lib/logger');
var common = require('./lib/common');


var DEFAULT_LOGGER, DEFAULTS, SETTINGS;

DEFAULTS = SETTINGS = {

    basedir: null,

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


function createWinstonLogger(settings) {

    function createTransport(type) {
        var ctor, options;

        ctor = type[0].toUpperCase() + type.slice(1);
        options = settings.transports[type];
        options.timestamp = typeof options.timestamp === 'function' ? options.timestamp : common.formatDate;

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

    if (!DEFAULT_LOGGER) {
        pine.configure(DEFAULTS);
    }

    name = name || caller();
    name = (name === path.resolve(name)) ? path.relative(SETTINGS.basedir, name) : name;
    options = options && _.defaults(options, SETTINGS.transports);

    // Custom options result in a new logger, otherwise reuse default.
    return logger(name, options ? createWinstonLogger(options) : DEFAULT_LOGGER);
}


Object.defineProperty(pine, 'configure', {
    value: function configure(options) {
        var parent, root;

        if (!options.basedir) {
            parent = path.dirname(caller());
            root = common.findFile('package.json', parent);
            options.basedir = root ? path.dirname(root): parent;
        }

        SETTINGS = Object.freeze(_.defaults(options, DEFAULTS));
        DEFAULT_LOGGER = createWinstonLogger(SETTINGS);
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

