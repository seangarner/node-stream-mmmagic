var mmm = require('mmmagic'),
    peek = require('buffer-peek-stream'),
    _ = require('lodash');

function streamMmmagic(stream, optionsOpt, callback) {
  var args = [], 
    _options,
    i;
  for (i = 0; i < arguments.length; i++) {
    args.push(arguments[i]); 
  }
  stream = args.shift();
  callback = args.pop();
  if (args.length > 0 && typeof args[0] === 'object') {
    optionsOpt = args[0];
  } else {
    optionsOpt = {};
  }
  _options = _.merge({
    splitMime: true
  }, config, optionsOpt);
  // peek 16K which is more than you need for type but gives libmagic a better chance of
  // accurately detecting the encoding
  return peek(stream, 16384, function (err, buf, dest) {
    if (err) return callback(err, null, dest);
    var magic;
    if (_options.magicFile) {
      magic = new mmm.Magic(config.magicFile, mmm.MAGIC_MIME);
    } else {
      magic = new mmm.Magic(mmm.MAGIC_MIME);
    }
    magic.detect(buf, function (err, res) {
      if (err) return callback(err, null, dest);
      if (_options.splitMime) {
        callback(null, splitMime(res), dest);
      } else {
        callback(null, res, dest);
      }
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