class NotFoundError extends Error {
  constructor(message = 'Такого пользователя или карточки нет', ...rest) {
    super(...rest);
    this.status = 404;
    this.message = message;
  }
}

module.exports = NotFoundError;
