'use strict';

const mmm = require('mmmagic');
const peek = require('buffer-peek-stream');

function streamMmmagic(stream, options, callback) {

  if (!callback) {
    callback = options;
    options = {};
  }

  const wantSplit = options.splitMime === undefined ? true : options.splitMime;
  const magicFile = options.magicFile;
  const peekBytes = options.peekBytes || 16384;

  // peek 16K which is more than you need for type; more would give it better chance on encoding
  return peek(stream, peekBytes, (err, buf, dest) => {
    if (err) return callback(err, null, dest);

    let magic;
    if (magicFile) {
      if (magicFiles.hasOwnProperty(magicFile)) {
        magic = magicFiles[magicFile];
      } else {
        magic = magicFiles[magicFile] = new mmm.Magic(magicFile, mmm.MAGIC_MIME);
      }
    } else {
      magic = _magic;
    }

    magic.detect(buf, (err, res) => {
      if (err) return callback(err, null, dest);
      if (wantSplit) {
        res = splitMime(res);
      }
      callback(null, res, dest);
    });
  });
}

const _magic = new mmm.Magic(mmm.MAGIC_MIME);
const magicFiles = {};

module.exports = streamMmmagic;

module.exports.promise = function streamMmmagicPromise(input, options) {
  return new Promise((resolve, reject) => {
    streamMmmagic(input, options || {}, (err, mime, output) => {
      if (err) return reject(err);
      resolve([mime, output]);
    })
  });
}

var _splitMime = /^(.*); charset=(.*)$/;
function splitMime(s) {
  var p = s.match(_splitMime);
  return {
    type: p[1],
    encoding: p[2]
  };
}
