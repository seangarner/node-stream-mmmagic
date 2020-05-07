# node-stream-mmmagic
[![Build Status](https://travis-ci.org/seangarner/node-stream-mmmagic.svg?branch=master)](https://travis-ci.org/seangarner/node-stream-mmmagic)

Node module to sniff the start of a stream (non-destructively) to detect the file type and encoding
when you don't have the luxury of being able to restart the stream again.

It does so by using [buffer-peek-stream](https://github.com/seangarner/node-buffer-peek-stream) to
get the first 16KB of the stream then send that to mmmagic (which uses libmagic).  Before it's
finished the peek stream will unshift the bytes it's received back onto the origin stream thereby
making it appear as if the origin stream was new.

```bash
npm install stream-mmmagic
```

### Use
```js
const magic = require('stream-mmmagic');
const input = fs.createReadStream('somefile.csv');

const [mime, output] = await magic.promise(input);
console.log('TYPE:', mime.type);
console.log('ENCODING:', mime.encoding);
output.pipe(process.stdout);

//- TYPE: text/plain
//- ENCODING: us-ascii
//- <the file content>
```


## Use (Callbacks)
```js
var magic = require('stream-mmmagic');

var input = fs.createReadStream('somefile.csv');

magic(input, function (err, mime, output) {
  if (err) throw err;

  console.log('TYPE:', mime.type);
  console.log('ENCODING:', mime.encoding);

  // will print the *whole* file
  output.pipe(process.stdout);
});

//- TYPE: text/plain
//- ENCODING: us-ascii
//- <the file content>
```

### `options.magicFile` Custom Magic File
A magic file is bundled with the mmmagic npm module but if you want to use your own then set the path to the file on
the `magicFile` option.

```js
const magicFile = '/usr/share/magic';
magic(input, {magicFile}, callback);
```

### `options.splitMime` Original Mime String
Use `{splitMime: false}` option to get back the original mime string instead of a split object.
```js
const [mime] = magic.promise(input, {splitMime: false});
console.log(mime);
//- text/plain; charset=us-ascii
```

### `options.peekBytes` Control Bytes Used for Analysis
As the input stream starts to get data the first 16KB is buffered and sent to libmagic for analysis to get file type and
encoding.  1KB is more than enough for detecting file type with a standard `magicFile` but the reliabilty of getting the
correct encoding is increased the more bytes are buffered.  The tradeoff is performance and memory use.

Set `peekBytes` to the number of bytes you want buffered and sent to libmagic.  For best results do not set below 256
bytes.

```js
// somefile.txt is a utf8 file where the first doublebyte char is after the first 1KB of the file
const input = fs.createReadStream('somefile.txt');

const [{encoding}, output] = magic.promise(input, {peekBytes: 1024});
console.log(encoding);
// not detected as utf8 because the first doublebyte char wasn't until later in the stream
//- us-ascii

const [{encoding}, output] = magic.promise(input, {peekBytes: 16384});
console.log(encoding);
// now we're peeking 16KB into the file libmagic gets that first doublebyte char and knows it's utf8
//- charset=utf8
```

## LICENSE
MIT
