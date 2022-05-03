const jwt = require('jsonwebtoken');
const {
  SECRET_CODE,
  UNAUTHORIZED_ERROR_CODE,
} = require('../utils/utils');

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(UNAUTHORIZED_ERROR_CODE).send({ message: 'Авторизация не пройдена' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET_CODE);
  } catch (err) {
    return new Error({ message: err.message });
  }
  req.user = payload;

  return next();
};
