var fs = require('fs'),
    path = require('path'),

    streamMmmagic = require('../lib/stream-mmmagic');

    stream = fs.createReadStream(path.join(__dirname, '..', 'package.json'));

streamMmmagic(stream, { splitMime: false }, function (err, mime, stream) {
    if (err) {
        throw err;
    }

    console.log('MIME: ' + mime);

    streamMmmagic(stream, function (err, mime, stream) {

        console.log('MIME SPLITTED: ', mime);

    });
});