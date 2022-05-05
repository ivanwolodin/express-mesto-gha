class PrivilegeError extends Error {
  constructor(message = 'Недостаточно прав для данной операции', ...rest) {
    super(...rest);
    this.status = 403;
    this.message = message;
  }
}

module.exports = PrivilegeError;
