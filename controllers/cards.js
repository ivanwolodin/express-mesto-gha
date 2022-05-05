const Card = require('../models/card');
const { NotFoundError } = require('../errors/notFoundError');
const { AuthorizationError } = require('../errors/authorzationError');
const { BadRequestError } = require('../errors/badRequestError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCardById = (req, res, next) => {
  Card.findById(req.params._id)
    .orFail(new NotFoundError({ message: 'Нет карточки с таким id' }))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new AuthorizationError({ message: 'Недостаточно прав для данной операции' });
      }
      Card.findByIdAndDelete(req.params._id)
        .then((cardData) => {
          res.send({ data: cardData });
        })
        .catch(next);
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .orFail(new BadRequestError({ message: 'Не удалось создать карточку' }))
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'Такой карточки нет' });
      }

      if (!link || !name) {
        throw new BadRequestError({ message: 'Не передано одно из полей' });
      }
      return res.status(201).send(card);
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .orFail(new BadRequestError({ message: 'Некорректные данные' }))
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'Такой карточки нет' });
      }
      return res.send(card);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .orFail(new BadRequestError({ message: 'Некорректные данные' }))
    .then((card) => {
      if (!card) {
        throw new NotFoundError({ message: 'Такой карточки нет' });
      }
      return res.send(card);
    })
    .catch(next);
};
