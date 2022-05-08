const Card = require('../models/card');
const { NotFoundError } = require('../errors/NotFoundError');
const { BadRequestError } = require('../errors/BadRequestError');
const { PrivilegeError } = require('../errors/PrivilegeError');

module.exports.getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res.send({ data: cards });
  } catch (e) {
    next(e);
  }
};

module.exports.deleteCardById = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params._id);
    if (!card) {
      next(new NotFoundError('Нет карточки с таким id'));
    }
    if (card.owner.toString() !== req.user._id) {
      next(new PrivilegeError());
    }
    const cardData = await Card.findByIdAndRemove(req.params._id);
    res.send({ data: cardData });
  } catch (e) {
    next(e);
  }
};

module.exports.createCard = async (req, res, next) => {
  const { name, link } = req.body;
  try {
    if (!link || !name) {
      next(new BadRequestError('Не передано одно из полей'));
    }
    const card = await Card.create({ name, link, owner: req.user._id });
    if (!card) {
      next(new BadRequestError('Не удалось создать карточку'));
    }
    res.send({ card });
  } catch (e) {
    next(e);
  }
};

module.exports.likeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      next(new NotFoundError('Такой карточки нет'));
      return;
    }
    res.send({ card });
  } catch (e) {
    next(e);
  }
};

module.exports.dislikeCard = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!card) {
      next(new NotFoundError('Такой карточки нет'));
      return;
    }
    res.send({ card });
  } catch (e) {
    next(e);
  }
};
