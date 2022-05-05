class DataBaseError extends Error {
  constructor(message = 'Пользователь с такой почтой уже зарегистрирован', ...rest) {
    super(...rest);
    this.status = 409;
    this.message = message;
  }
}

module.exports = DataBaseError;
