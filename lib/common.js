'use strict';

var fs = require('fs');
var util = require('util');
var path = require('path');
var caller = require('caller');


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
    month   = zeroPad(now.getMonth() + 1, 2);
    day     = zeroPad(now.getDate(), 2);
    hours   = zeroPad(now.getHours(), 2);
    minutes = zeroPad(now.getMinutes(), 2);
    seconds = zeroPad(now.getSeconds(), 2);
    milli   = zeroPad(now.getMilliseconds(), 3);

    return util.format('[%s-%s-%s %s:%s:%s.%s]', year, month, day, hours, minutes, seconds, milli);
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