const User = require('../models/user');

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
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!avatar) {
    return res.status(400).send({ message: 'Не передано поле avatar' });
  }

  if (!about) {
    return res.status(400).send({ message: 'Не передано поле about' });
  }

  if (!name) {
    return res.status(400).send({ message: 'Не передано поле name' });
  }

  User.create({ name, about, avatar })
    .then((user) => {
      res.statusCode = 201;
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  if (!avatar) {
    return res.status(400).send({ message: 'Не передано поле avatar' });
  }

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then((user) => res.send({ _id: user._id, avatar }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};
