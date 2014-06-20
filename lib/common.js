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

var fs = require('fs');
var util = require('util');
var path = require('path');
var caller = require('caller');
var winston = require('winston');


function padLeft(str, length, char) {
    str = String(str);
    while (str.length < length) {
        str = char + str;
    }
    return str;
}


function zeroPad(str, len) {
    return padLeft(str, len, '0');
}


exports.formatDate = function formatDate(date) {
    var now, year, month, day, hours, minutes, seconds, milli;

    now = date || new Date();
    year = now.getFullYear();
    month   = zeroPad(now.getUTCMonth() + 1, 2);
    day     = zeroPad(now.getUTCDate(), 2);
    hours   = zeroPad(now.getUTCHours(), 2);
    minutes = zeroPad(now.getUTCMinutes(), 2);
    seconds = zeroPad(now.getUTCSeconds(), 2);
    milli   = zeroPad(now.getUTCMilliseconds(), 3);

    return util.format('[%s-%s-%s %s:%s:%s.%s UTC]', year, month, day, hours, minutes, seconds, milli);
};



exports.findFile = function findFile(file, dir) {
    var files, parent;

    dir = dir || path.dirname(caller());
    dir = path.resolve(dir);

    files = fs.readdirSync(dir);
    if (~files.indexOf(file)) {
        return path.join(dir, file);
    }

    parent = path.dirname(dir);
    if (dir === parent) {
        return undefined;
    }

    return findFile(file, parent);
};


exports.createWinstonLogger = function createWinstonLogger(settings) {

    function createTransport(type) {
        var ctor, transport;

        ctor = type[0].toUpperCase() + type.slice(1);

        transport = new winston.transports[ctor](settings.transports[type]);
        transport.timestamp = transport.timestamp || exports.formatDate;
        return transport;
    }

    if (settings.exceptionHandlers) {
        settings.exceptionHandlers = Object.keys(settings.exceptionHandlers).map(createTransport);
    }

    return new winston.Logger({
        levels: settings.levels,
        colors: settings.colors,
        transports: Object.keys(settings.transports).map(createTransport),
        exceptionHandlers: settings.exceptionHandlers,
        exitOnError: false
    });
};


exports.deepFreeze = function deepFreeze(obj) {
    var key;

    if (typeof obj === 'object' && obj !== null &&  !Object.isFrozen(obj)) {
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                obj[key] = deepFreeze(obj[key]);
            }
        }
        return Object.freeze(obj);
    }

    return obj;
};