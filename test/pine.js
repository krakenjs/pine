'use strict';

var test = require('tape');
var pine = require('../');

test('pine', function (t) {

    pine.configure({

        dirname: __dirname,

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



    t.test('configureEnvironment', function (t) {
        var logger;

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