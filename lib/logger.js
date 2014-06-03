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

var util = require('util');
var slice = Array.prototype.slice.call.bind(Array.prototype.slice);


var proto = {

    log: function log(level, message) {
        var args;

        args = slice(arguments, 2);
        args.unshift(util.format('[%d:%s] %s', process.pid, this.name, message));
        args.unshift(level);

        this._impl.log.apply(this._impl, args);
        return this;
    }

};

module.exports = function createLogger(name, impl) {
    var logger;

    logger = Object.create(proto);

    Object.keys(impl.levels).forEach(function (level) {
        logger[level] = function () {
            var args;
            args = slice(arguments);
            args.unshift(level);
            return this.log.apply(this, args);
        };
    });

    return Object.create(logger, {

        name: {
            value: name,
            enumerable: true,
            writable: false
        },

        _impl: {
            value: impl,
            enumerable: false,
            writable: false,
            configurable: false
        }

    });

};