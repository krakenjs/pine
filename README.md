# pine

A simple logging wrapper.


## Usage
```javascript

var log = pine(); //
log.info('Hello, world!');
log.error('This Department Has Worked %d Days Without Injury', 0);
```

```bash
[2014-05-22 08:21:32.128] - info: [index.js] Hello, world!
[2014-05-22 08:29:23.397] - error: [index.js] This Department Has Worked 0 Days Without Injury
```