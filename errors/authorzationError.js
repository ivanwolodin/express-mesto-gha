class AuthorizationError extends Error {
  constructor(message = 'Авторизуйтесь для совершения данной операции') {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = { AuthorizationError };
