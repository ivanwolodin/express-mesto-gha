class BadRequestError extends Error {
  constructor(message = 'Неправильный запрос') {
    super(message);
    this.statusCode = 400;
  }
}

module.exports = { BadRequestError };
