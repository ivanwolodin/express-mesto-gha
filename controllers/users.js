const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');
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

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      next(new BadRequestError('Пользователь не найден'));
    }

    const user = await User.findUserByCredentials(email, password);
    const token = await jwt.sign(
      { _id: user._id },
      SECRET_CODE,
      { expiresIn: '7d' },
    );
    console.log(token);
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

// {
//   "name": "Test",
//   "about": "abouttest",
//   "avatar": "http://testlink.com",
//   "email": "vd@text4444.ru",
//   "hash": "$2a$10$8niaIwg7yj6jIhay5/94dOQhQaKSYNolTTNzddXnJBryTF9rH5WnC",
//   "user": {
//   "name": "Test",
//     "about": "abouttest",
//     "avatar": "http://testlink.com",
//     "_id": "6273f624fca3af31b27e57f4",
//     "email": "vd@text4444.ru",
//     "password": "$2a$10$8niaIwg7yj6jIhay5/94dOQhQaKSYNolTTNzddXnJBryTF9rH5WnC",
//     "__v": 0
// }
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjczZjYyNGZjYTNhZjMxYjI3ZTU3ZjQiLCJpYXQiOj
// E2NTE3NjY5MTcsImV4cCI6MTY1MjM3MTcxN30.csWX26-GVEOQa5Vcp1CSdPR-hgcDD9JZozclxKm6Vvo
// }
