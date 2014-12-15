pine
====

Lead Maintainer: [Jean-Charles Sisk](https://github.com/jasisk)  

[![Build Status](https://travis-ci.org/krakenjs/pine.svg?branch=master)](https://travis-ci.org/krakenjs/pine)  

A simple logging wrapper for Winston.


## Usage
```javascript
var pine = require('pine');

var log = pine();
log.info('Hello, world!');
log.error('This Department Has Worked %d Days Without Injury', 0);
```

```bash
[2014-05-22 21:00:39.704 UTC] - info: [26195:index.js] Hello, world!
[2014-05-22 21:00:39.705 UTC] - error: [26195:index.js] This Department Has Worked 0 Days Without Injury
```


### API
#### `pine([name] [,options])`
- `name` (optional, *String*) - If not provided, defaults to file path relative to parent package.
- `options` (optional, *Object*) - Same options as `pine.configure`. When provided will create logger with provided
settings, using configured global settings as defaults.

Invoke `pine` directly to get a logger instance. The API of the logger is determined by the configured levels, which defaults
to npm levels: silly, debug, verbose, info, warn, error. Additionally, there is a `log` method which accepts the desired
level as it's first argument. Each method also supports `util.format`-like string interpolation.

```javascript
var log = pine();
log.silly('Uptime: %d days', 10);
log.debug('Helpful information');
log.verbose('More information');
log.info('Did you know...');
log.warn('Well, actually...');
log.error('Iceberg!');
```


#### `pine.configure(options);`
- `options` - The default options which will be used for all loggers. The options object supports the
  following optional keys:
    - `basedir` - The root directory against which relative paths are calculated. Defaults to root of calling module.
    - `levels` - The winston levels to use. Defaults to `npm` levels.
    - `colors` - The colors to use. Defaults to `npm` colors.
      whether the client should reject a response from a server with invalid certificates.  This cannot be set at the
      same time as the `agent` option is set.
    - `transports` - The transports to use, mapping the transport name to settings. To use external or custom transports see
      the `modules` config options.
    - `modules` - Describe, for registration, the modules which implement the required custom transport.
    - `exceptionHandlers` - Transports to be used for logging exceptions. An object mapping the transport name to settings.


Set global logging settings, using built-in settings as defaults.

```javascript
pine.configure({

    basedir: __dirname,

    levels: undefined,

    colors: undefined,

    transports: {
        console: {
            level: 'debug'
        },
        mongodb: {
            level: 'info',
            db: 'logs',
            host: '127.0.0.1',
            port: '27017'
        }
    },

    modules: {
        mongodb: {
            name: 'winston-mongodb',
            property: 'MongoDB'
        }
    },

    exceptionHandlers: undefined
});
```


#### `pine.settings`
Read-only property of current global default settings.
