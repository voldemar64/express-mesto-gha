class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.name = 'CastError';
    this.statusCode = 400;
  }
}

module.exports = BadRequest;
