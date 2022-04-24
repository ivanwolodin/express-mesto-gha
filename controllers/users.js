const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then(users => res.send({data: users}))
    .catch(err => res.status(500).send({message: err.message}));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then(user => {
      if (!user) {
        return res.status(404).send({message: 'Нет такого пользователя'});
      }
      res.send({data: user});
    })
    .catch(err => res.status(500).send({message: 'Произошла ошибка'}));
}

module.exports.createUser = (req, res) => {
  const {name, about, avatar} = req.body;

  User.create({name, about, avatar})
    .then(user => {
      if (!user) {
        return res.status(400).send({message: 'Некорректные данные для создания пользователя'});
      }
      res.send({data: user});
    })
    .catch(err => res.status(500).send({message: err.message}));
};

module.exports.updateUserInfo = (req, res) => {
  const {name, about} = req.body;

  User.findByIdAndUpdate(req.user._id, {name, about})
    .then(user => {
      if (!user) {
        return res.status(400).send({message: 'Некорректные данные для обновления пользователя'});
      }
      res.send({data: user})
    })
    .catch(err => res.status(500).send({message: err.message}));
};

module.exports.updateUserAvatar = (req, res) => {
  const {avatar} = req.body;

  User.findByIdAndUpdate(req.user._id, {avatar})
    .then(user => {
      if (!user) {
        return res.status(400).send({message: 'Некорректные данные для обновления аватара'});
      }
      res.send({data: user})
    })
    .catch(err => res.status(500).send({message: err.message}));
};
