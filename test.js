var fs = require('fs');
var magic = require('./');
var stream = require('stream');
var expect = require('chai').expect;
var concat = require('concat-stream');

describe('stream-mmmagic', () => {
  function getStream() {
    var rs = fs.createReadStream(__filename, {encoding: 'utf8'});
    after(() => {
      rs.close();
    });
    return rs;
  }

  it('should callback a Readable stream', (done) => {
    magic(getStream(), function (err, mime, output) {
      if (err) return done(err);
      expect(output).to.be.an.instanceof(stream.Readable);
      done();
    });
  });

  it('should not callback a readstream with partially read data', (done) => {
    getStream().pipe(concat((sansMagic) => {
      magic(getStream(), function (err, mime, output) {
        if (err) return done(err);
        output.setEncoding('utf8');
        output.pipe(concat((withMagic) => {
          expect(withMagic).to.eql(sansMagic);
          done();
        }));
      });
    }));
  });

  it('should callback a mime type split into type and encoding', (done) => {
    magic(getStream(), function (err, mime, output) {
      if (err) return done(err);
      expect(mime).to.eql({
        type: 'text/plain',
        // 🦄 force utf8 encoding of this file for the test
        encoding: 'utf-8'
      });
      done();
    });
  });

});
