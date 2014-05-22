'use strict';

var test = require('tape');
var freshy = require('freshy');
var winston = require('winston');


test('pine', function (t) {
    var pine, log;

    t.test('defaults', function (t) {
        pine = freshy.freshy('../');

        // Derived name
        log = pine();
        t.ok(log);
        t.ok(log._impl.transports.console);
        t.equal(log.name, 'test/pine.js');
        t.equal(typeof log.log, 'function');
        t.equal(typeof log.silly, 'function');
        t.equal(typeof log.debug, 'function');
        t.equal(typeof log.verbose, 'function');
        t.equal(typeof log.info, 'function');
        t.equal(typeof log.warn, 'function');
        t.equal(typeof log.error, 'function');

        // Explicit arbitrary name
        log = pine('myLogger');
        t.ok(log);
        t.ok(log._impl.transports.console);
        t.equal(log.name, 'myLogger');
        t.equal(typeof log.log, 'function');
        t.equal(typeof log.silly, 'function');
        t.equal(typeof log.debug, 'function');
        t.equal(typeof log.verbose, 'function');
        t.equal(typeof log.info, 'function');
        t.equal(typeof log.warn, 'function');
        t.equal(typeof log.error, 'function');

        // Explicit file
        log = pine(__filename);
        t.ok(log);
        t.ok(log._impl.transports.console);
        t.equal(log.name, 'test/pine.js');
        t.equal(typeof log.log, 'function');
        t.equal(typeof log.silly, 'function');
        t.equal(typeof log.debug, 'function');
        t.equal(typeof log.verbose, 'function');
        t.equal(typeof log.info, 'function');
        t.equal(typeof log.warn, 'function');
        t.equal(typeof log.error, 'function');

        t.end();
    });



    t.test('configure', function (t) {
        var log, memory;

        pine = freshy.freshy('../');
        pine.configure({

            basedir: __dirname,

            transports: {
                memory: {}
            }

        });


        // Derived name
        log = pine();
        memory = log._impl.transports.memory;

        t.ok(log);
        t.ok(memory);
        t.equal(memory.writeOutput.length, 0);
        t.equal(log.name, 'pine.js');

        log.log('info', 'test', 123);
        t.ok(/info/.test(memory.writeOutput[0]));
        t.ok(/pine\.js/.test(memory.writeOutput[0]));
        t.ok(/test 123/.test(memory.writeOutput[0]));


        log.info('test %d', 456);
        t.ok(/info/.test(memory.writeOutput[1]));
        t.ok(/pine\.js/.test(memory.writeOutput[1]));
        t.ok(/test 456/.test(memory.writeOutput[1]));


        // Explicit arbitrary name
        log = pine('myLogger');
        t.ok(log);
        t.equal(log.name, 'myLogger');

        log.log('info', 'test', 123);
        t.ok(/info/.test(memory.writeOutput[2]));
        t.ok(/myLogger/.test(memory.writeOutput[2]));
        t.ok(/test 123/.test(memory.writeOutput[2]));


        log.info('test %d', 456);
        t.ok(/info/.test(memory.writeOutput[3]));
        t.ok(/myLogger/.test(memory.writeOutput[3]));
        t.ok(/test 456/.test(memory.writeOutput[3]));

        // Explicit file
        log = pine(__filename);
        t.ok(log);
        t.equal(log.name, 'pine.js');

        log.log('info', 'test', 123);
        t.ok(/info/.test(memory.writeOutput[4]));
        t.ok(/pine\.js/.test(memory.writeOutput[4]));
        t.ok(/test 123/.test(memory.writeOutput[4]));


        log.info('test %d', 456);
        t.ok(/info/.test(memory.writeOutput[5]));
        t.ok(/pine\.js/.test(memory.writeOutput[5]));
        t.ok(/test 456/.test(memory.writeOutput[5]));

        t.end();
    });


    t.test('no basedir', function (t) {
        var log, memory;

        pine = freshy.freshy('../');
        pine.configure({

            transports: {
                memory: {}
            }

        });

        log = pine();
        memory = log._impl.transports.memory;

        t.equal(log.name, 'test/pine.js');

        log.log('info', 'test 123');
        t.ok(/info/.test(memory.writeOutput[0]));
        t.ok(/test\/pine\.js/.test(memory.writeOutput[0]));
        t.ok(/test 123/.test(memory.writeOutput[0]));

        t.end();
    });



});