# stream-mmmagic changelog

## 1.0.1 (2016/12/21)
Possibility to specify options in streamMmmagic function call.
Currently supported options are:
  - `splitMerge` (boolean, default true): return an object containing mime type and encoding separately, rather than a simple string (i.e. `MIME; encoding=ENCODING`)
  - `magicFile` (file path, default null): custon mmmagic file, same as setting the `magic.config.magicFile`
The options argument is optional. streamMmmagic(input, callback) will use default options values.

## 1.0.0 (2016/08/31)
is backwards compatible with `0.2.0`; bump signifies this is now considered stable after being used 100,000s of times
in a production environment.

  - add support for node 5 & 6

## 0.2.0 (2014/11/12)
**backwards incompatible** using semver; api not stable until 1.0.0

  - function now returns a stream which should be piped from instead of the input stream
  - fix many issues with edge case streams, especially small binary ones

## 0.1.0 (2014/11/06)
*don't use; broken for streams that emit more than 1 chunk*
