const jwt = require('jsonwebtoken');
const {
  JWT_TOKEN,
} = require('../utils/utils');
const { AuthorizationError } = require('../errors/AuthorizationError');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new AuthorizationError('Авторизация не пройдена'));
  }
  const token = authorization.replace('Bearer ', '');

  let payload;
  try {
    payload = jwt.verify(token, JWT_TOKEN);
  } catch (err) {
    next(new AuthorizationError('Авторизация не пройдена'));
  }
  req.user = payload;
  return next();
};
