class DataBaseError extends Error {
  constructor(message = 'Пользователь с такой почтой уже зарегистрирован') {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = { DataBaseError };
