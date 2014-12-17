var mmm = require('mmmagic');
var peek = require('buffer-peek-stream');

function streamMmmagic(stream, callback) {
  // peek 16K which is more than you need for type but gives libmagic a better chance of
  // accurately detecting the encoding
  return peek(stream, 16384, function (err, buf, dest) {
    if (err) return callback(err, null, dest);
    var magic = config.magicFile
        ? new mmm.Magic(config.magicFile, mmm.MAGIC_MIME)
        : new mmm.Magic(mmm.MAGIC_MIME);
    magic.detect(buf, function (err, res) {
      if (err) return callback(err, null, dest);
      callback(null, splitMime(res), dest);
    });
  });
}

var config = {
    magicFile: null
};

streamMmmagic.config = config;
module.exports = streamMmmagic;

var _splitMime = /^(.*); charset=(.*)$/;
function splitMime(s) {
  var p = s.match(_splitMime);
  return {
    type: p[1],
    encoding: p[2]
  };
}