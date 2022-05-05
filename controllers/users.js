const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NotFoundError } = require('../errors/notFoundError');
const { BadRequestError } = require('../errors/badRequestError');
const { DataBaseError } = require('../errors/DataBaseError');

const User = require('../models/user');
const {
  CAST_ERROR,
  SECRET_CODE,
  VALIDATION_ERROR,
} = require('../utils/utils');

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.send({ data: users });
  } catch (e) {
    next(e);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.body._id);
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

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body;

    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    res.statusCode = 201;
    await res.send({
      name,
      about,
      avatar,
      email,
    });
  } catch (e) {
    if (e.code === 11000) {
      next(new DataBaseError());
    } else if (e.name === VALIDATION_ERROR || e.name === CAST_ERROR) {
      next(new BadRequestError());
    } else {
      next(e);
    }
  }
};

module.exports.updateUserInfo = async (req, res, next) => {
  const { name, about } = req.body;
  try {
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
  const { avatar } = req.body;
  try {
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

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByCredentials(email, password);
    const token = await jwt.sign(
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
  } catch (e) {
    next(e);
  }
};
