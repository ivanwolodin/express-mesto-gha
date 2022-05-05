class PrivilegeError extends Error {
  constructor(message = 'Недостаточно прав для данной операции') {
    super(message);
    this.statusCode = 403;
  }
}

module.exports = { PrivilegeError };
