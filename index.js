'use strict';

var _ = require('lodash-node');
var path = require('path');
var caller = require('caller');
var winston = require('winston');
var logger = require('./lib/logger');
var common = require('./lib/common');


var DEFAULT_LOGGER, DEFAULTS, SETTINGS;

DEFAULT_LOGGER = null;
DEFAULTS = SETTINGS = {

    basedir: null,

    levels: winston.config.npm.levels,

    colors: winston.config.npm.colors,

    transports: {
        console: {
            level: 'debug'
        }
    },

    exceptions: {}

};


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
    options = options && _.defaults(options, SETTINGS);

    // Custom options result in a new logger, otherwise reuse default.
    return logger(name, options ? common.createWinstonLogger(options) : DEFAULT_LOGGER);
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
        DEFAULT_LOGGER = common.createWinstonLogger(SETTINGS);
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

