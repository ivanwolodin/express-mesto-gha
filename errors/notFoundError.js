class NotFoundError extends Error {
  constructor(message = 'Такого пользователя или карточки нет') {
    super(message);
    this.statusCode = 404;
  }
}

module.exports = { NotFoundError };
