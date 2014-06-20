/*───────────────────────────────────────────────────────────────────────────*\
 │  Copyright (C) 2014 eBay Software Foundation                                │
 │                                                                             │
 │hh ,'""`.                                                                    │
 │  / _  _ \  Licensed under the Apache License, Version 2.0 (the "License");  │
 │  |(@)(@)|  you may not use this file except in compliance with the License. │
 │  )  __  (  You may obtain a copy of the License at                          │
 │ /,'))((`.\                                                                  │
 │(( ((  )) ))    http://www.apache.org/licenses/LICENSE-2.0                   │
 │ `\ `)(' /'                                                                  │
 │                                                                             │
 │   Unless required by applicable law or agreed to in writing, software       │
 │   distributed under the License is distributed on an "AS IS" BASIS,         │
 │   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  │
 │   See the License for the specific language governing permissions and       │
 │   limitations under the License.                                            │
 \*───────────────────────────────────────────────────────────────────────────*/
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

    exceptionHandlers: null,

    exitOnError: false

};


function pine(name, options) {
    var parent, root;

    if (typeof name === 'object') {
        options = name;
        name = undefined;
    }

    if (!DEFAULT_LOGGER) {
        parent = path.dirname(caller());
        root = common.findFile('package.json', parent);
        DEFAULTS.basedir = root ? path.dirname(root): parent;
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

        SETTINGS = common.deepFreeze(_.defaults(options, DEFAULTS));
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

