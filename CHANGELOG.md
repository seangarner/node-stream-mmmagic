# truncate-stream changelog

## 0.2.0 (2014/11/12)
**backwards incompatible** using semver; api not stable until 1.0.0

  - function now returns a stream which should be piped from instead of the input stream
  - fix many issues with edge case streams, especially small binary ones

## 0.1.0 (2014/11/06)
*don't use; broken for streams that emit more than 1 chunk*