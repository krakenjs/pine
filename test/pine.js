'use strict';

var test = require('tape');
var freshy = require('freshy');


test('pine', function (t) {
    var pine, log;

    t.test('defaults', function (t) {
        pine = freshy.freshy('../');

        // Derived name
        log = pine();
        t.ok(log);
        t.equal(log.name, 'test/pine.js');
        t.equal(typeof log.log, 'function');
        t.equal(typeof log.silly, 'function');
        t.equal(typeof log.debug, 'function');
        t.equal(typeof log.verbose, 'function');
        t.equal(typeof log.info, 'function');
        t.equal(typeof log.warn, 'function');
        t.equal(typeof log.error, 'function');
        log.info('Hello, world!');

        // Explicit arbitrary name
        log = pine('myLogger');
        t.ok(log);
        t.equal(log.name, 'myLogger');
        t.equal(typeof log.log, 'function');
        t.equal(typeof log.silly, 'function');
        t.equal(typeof log.debug, 'function');
        t.equal(typeof log.verbose, 'function');
        t.equal(typeof log.info, 'function');
        t.equal(typeof log.warn, 'function');
        t.equal(typeof log.error, 'function');
        log.info('Hello, world!');

        // Explicit file
        log = pine(__filename);
        t.ok(log);
        t.equal(log.name, 'test/pine.js');
        t.equal(typeof log.log, 'function');
        t.equal(typeof log.silly, 'function');
        t.equal(typeof log.debug, 'function');
        t.equal(typeof log.verbose, 'function');
        t.equal(typeof log.info, 'function');
        t.equal(typeof log.warn, 'function');
        t.equal(typeof log.error, 'function');
        log.info('Hello, world!');

        t.end();
    });



    t.test('configure', function (t) {
        var logger;

        pine = freshy.freshy('../');
        pine.configure({

            basedir: __dirname,

            transports: {
                console: {
                    level: 'debug',
                    colorize: true
                }
            },

            exceptionHandlers: {
                console: {
                    colorize: true
                }
            }

        });



        logger = pine();
        t.ok(logger);
        t.equal(logger.name, 'pine.js');
        t.equal(typeof logger.log, 'function');
        t.equal(logger.log('test'), logger);
        logger.log('info', 'test', 456);
        logger.info('test %d', 123);


        logger = pine('pine');
        t.ok(logger);
        t.equal(logger.name, 'pine');
        t.equal(typeof logger.log, 'function');
        t.equal(logger.log('test'), logger);
        logger.log('info', 'test');
        logger.info('test %d', 123);


        logger = pine(__filename);
        t.ok(logger);
        t.equal(logger.name, 'pine.js');
        t.equal(typeof logger.log, 'function');
        t.equal(logger.log('test'), logger);
        logger.log('info', 'test');
        logger.error('test %d', 123);

        t.end();
    });

});