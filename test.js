const fs = require('fs');
const magic = require('./');
const stream = require('stream');
const expect = require('chai').expect;
const concat = require('concat-stream');

describe('stream-mmmagic', () => {
  function getStream() {
    const rs = fs.createReadStream(__filename, {encoding: 'utf8'});
    after(() => {
      rs.close();
    });
    return rs;
  }

  it('should callback a Readable stream', (done) => {
    magic(getStream(), (err, mime, output) => {
      if (err) return done(err);
      expect(output).to.be.an.instanceof(stream.Readable);
      done();
    });
  });

  it('should not callback a readstream with partially read data', (done) => {
    getStream().pipe(concat((sansMagic) => {
      magic(getStream(), (err, mime, output) => {
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
    magic(getStream(), (err, mime, output) => {
      if (err) return done(err);
      expect(mime).to.eql({
        type: 'text/plain',
        // 🦄 force utf8 encoding of this file for the test
        encoding: 'utf-8'
      });
      done();
    });
  });

  it('should callback a mime string if splitMime:false', (done) => {
    magic(getStream(), {splitMime: false}, (err, mime, output) => {
      if (err) return done(err);
      expect(mime).to.equal('text/plain; charset=utf-8');
      done();
    });
  });

  it('should create new Magic object if a magicFile is specified', (done) => {
    const magicFile = 'node_modules/mmmagic/magic/magic.mgc';
    magic(getStream(), {magicFile}, (err, mime, output) => {
      if (err) return done(err);
      expect(mime).to.eql({
        type: 'text/plain',
        encoding: 'utf-8'
      });
      done();
    });
  });

  describe('promise', () => {
    it('should return a promise', async () => {
      expect(magic.promise(getStream())).to.be.a('promise');
    });

    it('should resolve an array with the mime type & output stream', async () => {
      const result = await magic.promise(getStream());
      expect(result).to.be.an('array').with.lengthOf(2);
      const [mime, output] = result;
      expect(mime).to.eql({
        type: 'text/plain',
        encoding: 'utf-8' // 🦄 force utf8 encoding of this file for the test
      });
      expect(output).to.be.an.instanceof(stream.Readable);
    });
  });

});
