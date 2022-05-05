const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DataBaseError } = require('../errors/dataBaseError');
const { NotFoundError } = require('../errors/notFoundError');

const User = require('../models/user');
const {
  VALIDATION_ERROR_CODE,
  CAST_ERROR,
  SECRET_CODE,
  NOT_FOUND_ERROR_CODE,
} = require('../utils/utils');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUserById = (req, res) => {
  User.findById(req.body._id)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10).then(
    (hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }),
  )
    .catch((err) => {
      if (err.code === 11000) {
        throw new DataBaseError({ message: 'Пользователь с таким email уже зарегистрирован' });
      } else next(err);
    })
    .then((user) => {
      res.statusCode = 201;
      return res.send(user);
    })
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError({ message: 'Нет пользователя с таким id' }))
    .then((newAvatar) => res.send({ data: newAvatar }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        SECRET_CODE,
        { expiresIn: '7d' },
      );

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Успешная авторизация' });
    })
    .catch(next);
};
