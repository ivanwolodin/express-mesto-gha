const User = require('../models/user');

const VALIDATION_ERROR = 'ValidationError';
const CAST_ERROR = 'CastError';
const VALIDATION_ERROR_CODE = 400;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь не найден' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      if (!avatar) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Не передано поле avatar' });
      }

      if (!about) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Не передано поле about' });
      }

      if (!name) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Не передано поле name' });
      }

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
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
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
