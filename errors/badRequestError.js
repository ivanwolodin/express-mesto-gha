class BadRequestError extends Error {
  constructor(message = 'Неправильный запрос', ...rest) {
    super(...rest);
    this.status = 400;
    this.message = message;
  }
}

module.exports = BadRequestError;
