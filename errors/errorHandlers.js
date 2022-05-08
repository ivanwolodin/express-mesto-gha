const { NotFoundError } = require('./NotFoundError');

module.exports.handler404 = async (req, res, next) => {
  next(new NotFoundError('страница не найдена'));
};

module.exports.handler500 = async (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
};
