var mmm = require('mmmagic');
var peek = require('buffer-peek-stream');

function streamMmmagic(stream, callback) {
  // peek 65K which is more than you need for type but gives libmagic a better chance of
  // accurately detecting the encoding
  peek(stream, 65536, function (err, buf) {
    if (err) return callback(err);
    var magic = new mmm.Magic(mmm.MAGIC_MIME);
    magic.detect(buf, function (err, res) {
      if (err) return callback(err);
      callback(null, splitMime(res));
    });
  });
}

module.exports = streamMmmagic;

var _splitMime = /^(.*); charset=(.*)$/;
function splitMime(s) {
  var p = s.match(_splitMime);
  return {
    type: p[1],
    encoding: p[2]
  };
}