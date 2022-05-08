const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { DataBaseError } = require('../errors/DataBaseError');
const { VALIDATION_ERROR, CAST_ERROR, JWT_TOKEN } = require('../utils/utils');
const { BadRequestError } = require('../errors/BadRequestError');

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

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      next(new BadRequestError('Пользователь не найден'));
    }

    const user = await User.findUserByCredentials(email, password);
    const token = await jwt.sign(
      { _id: user._id },
      JWT_TOKEN,
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
