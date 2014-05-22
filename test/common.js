'use strict';

var test = require('tape');
var path = require('path');
var common = require('../lib/common');


test('common', function (t) {

    var pkg = path.resolve(__dirname, '..', 'package.json');

    t.test('findFile', function (t) {
        var file;

        file = common.findFile('package.json', '.');
        t.ok(file);
        t.equal(file, pkg);

        file = common.findFile('package.json', __dirname);
        t.ok(file);
        t.equal(file, pkg);

        file = common.findFile('package.json');
        t.ok(file);
        t.equal(file, pkg);

        t.end();
    })

});