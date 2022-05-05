class AuthorzationError extends Error {
  constructor(message = 'Авторизуйтесь для совершения данной операции', ...rest) {
    super(...rest);
    this.status = 403;
    this.message = message;
  }
}

module.exports = AuthorzationError;
