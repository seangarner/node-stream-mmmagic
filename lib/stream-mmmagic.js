var mmm = require('mmmagic');
var peek = require('buffer-peek-stream');

var magicMime = new mmm.Magic(mmm.MAGIC_MIME);

function streamMmmagic(stream, options, callback) {

  if (!callback) {
    callback = options;
    options = {
      splitMime: true
    };
  }

  var wantSplit = options.splitMime === undefined ? true : options.splitMime;
  var magicFile = config.magicFile;

  // peek 16K which is more than you need for type but gives libmagic a better chance of
  // accurately detecting the encoding
  return peek(stream, 16384, function (err, buf, dest) {
    if (err) return callback(err, null, dest);

    var magic = magicFile
        ? new mmm.Magic(magicFile, mmm.MAGIC_MIME)
        : magicMime;

    magic.detect(buf, function (err, res) {
      if (err) return callback(err, null, dest);
      if (wantSplit) {
        res = splitMime(res);
      }
      callback(null, res, dest);
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
