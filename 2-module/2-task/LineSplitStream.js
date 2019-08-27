const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.options = options;
  }

  _transform(chunk, encoding, callback) {
    const {encoding: code} = this.options;
    let data = chunk.toString(code);
    if (this.rest) data = this.rest + data;

    const lines = data.split(os.EOL);
    this.rest = lines.pop();

    lines.forEach((line) => this.push(line));
    callback();
  }

  _flush(callback) {
    if (this.rest) this.push(this.rest);
    this.rest = '';
    callback();
  }
}

module.exports = LineSplitStream;
