const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.options = options;
    this.data = '';
  }

  _transform(chunk, encoding, callback) {
    const {limit = 5} = this.options;
    this.data += chunk;
    if (Buffer.byteLength(this.data) <= limit ) {
      this.push(chunk);
    } else {
      callback(new LimitExceededError());
    }
    callback();
  }
}

module.exports = LimitSizeStream;
