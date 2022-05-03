const jwt = require('jsonwebtoken');
const {
  SECRET_CODE,
} = require('../utils/utils');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Авторизация не пройдена' });
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, SECRET_CODE);
  } catch (err) {
    return new Error('Авторизация не пройдена');
  }
  req.user = payload;

  return next();
};
