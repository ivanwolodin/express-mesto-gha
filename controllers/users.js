const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const {
  VALIDATION_ERROR,
  VALIDATION_ERROR_CODE,
  CAST_ERROR,
  SECRET_CODE,
  AUTHENTICATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
} = require('../utils/utils');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
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

module.exports.createUser = (req, res) => {
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
    .then((user) => {
      res.statusCode = 201;
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then((user) => res.send({ _id: user._id, avatar }))
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      if (!avatar) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Не передано поле avatar' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.login = (req, res) => {
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
    .catch(() => {
      res.status(AUTHENTICATION_ERROR_CODE).send({ message: 'Авторизация не пройдена' });
    });
};
