# pine

A simple logging wrapper.


## Usage
```javascript
var log = pine();
log.info('Hello, world!');
log.error('This Department Has Worked %d Days Without Injury', 0);
```

```bash
[2014-05-22 21:00:39.704 UTC] - info: [26195:index.js] Hello, world!
[2014-05-22 21:00:39.705 UTC] - error: [26195:index.js] This Department Has Worked 0 Days Without Injury
```