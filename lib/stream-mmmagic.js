var mmm = require('mmmagic');
var peek = require('buffer-peek-stream');

function streamMmmagic(stream, options, callback) {

  if (!callback) {
    callback = options;
    options = {
      splitMime: true,
      magicFile: null,
      peekBytes: null
    };
  }

  var wantSplit = options.splitMime === undefined ? true : options.splitMime;
  var magicFile = options.magicFile;
  var peekBytes = options.peekBytes || 1024;

  // peek 1K which is more than you need for type; more would give it better chance on encoding
  return peek(stream, peekBytes, function (err, buf, dest) {
    if (err) return callback(err, null, dest);

    var magic;
    if (magicFile) {
      if (magicFiles.hasOwnProperty(magicFile)) {
        magic = magicFiles[magicFile];
      } else {
        magic = magicFiles[magicFile] = new mmm.Magic(magicFile, mmm.MAGIC_MIME);
      }
    } else {
      magic = _magic;
    }

    magic.detect(buf, function (err, res) {
      if (err) return callback(err, null, dest);
      if (wantSplit) {
        res = splitMime(res);
      }
      callback(null, res, dest);
    });
  });
}

var _magic = new mmm.Magic(mmm.MAGIC_MIME);
var magicFiles = {};

module.exports = streamMmmagic;

var _splitMime = /^(.*); charset=(.*)$/;
function splitMime(s) {
  var p = s.match(_splitMime);
  return {
    type: p[1],
    encoding: p[2]
  };
}
