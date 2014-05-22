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
        var ctor, options;

        ctor = type[0].toUpperCase() + type.slice(1);
        options = settings.transports[type];
        options.timestamp = (typeof options.timestamp === 'function') ? options.timestamp : exports.formatDate;

        return new winston.transports[ctor](options);
    }

    return new winston.Logger({
        levels: settings.levels,
        colors: settings.colors,
        transports: Object.keys(settings.transports).map(createTransport),
        exceptionHandlers: Object.keys(settings.exceptionHandlers).map(createTransport),
        exitOnError: false
    });
};