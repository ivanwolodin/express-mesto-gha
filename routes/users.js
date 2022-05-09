const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUserById,
  updateUserInfo,
  updateUserAvatar,
  getMe,
} = require('../controllers/users');
const { REGEX_MAIL_CHECK } = require('../utils/utils');

router.get('/', getUsers);
router.get('/me', getMe);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(
      REGEX_MAIL_CHECK,
    ),
  }),
}), updateUserAvatar);

module.exports = router;
