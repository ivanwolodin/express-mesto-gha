const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');
const User = require('../models/user');
const {
  CAST_ERROR,
} = require('../utils/utils');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (e) {
    next(e);
  }
};

module.exports.getMe = async (req, res, next) => {
  try {
    const me = await User.findById(req.user._id);
    if (!me) {
      next(new NotFoundError('Нет такого пользователя'));
    }
    res.send({ data: me });
  } catch (e) {
    if (e.name === CAST_ERROR) {
      next(new BadRequestError('Некорректный id пользователя'));
    }
    next(e);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      next(new NotFoundError('Пользователь не найден'));
    }
    res.send(user);
  } catch (e) {
    if (e.name === CAST_ERROR) {
      next(new BadRequestError());
    } else {
      next(e);
    }
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      next(new NotFoundError('Пользователь не найден'));
    }
    res.send({ data: user });
  } catch (e) {
    next(e);
  }
};

module.exports.updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const newAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send({ data: newAvatar });
  } catch (e) {
    next(e);
  }
};
