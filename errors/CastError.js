class CastError extends Error {
  constructor(message) {
    super(message);
    this.name = 'CastError';
    this.statusCode = 403;
  }
}

module.exports = CastError;
