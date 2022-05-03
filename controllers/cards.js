const Card = require('../models/card');

const {
  VALIDATION_ERROR, VALIDATION_ERROR_CODE, CAST_ERROR, NOT_FOUND_ERROR_CODE,
} = require('../utils/utils');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.deleteCardById = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(NOT_FOUND_ERROR_CODE)
          .send({ message: 'Такой карточки нет' });
      }
      if (card.owner.toString() !== req.user._id) {
        throw Error({ message: 'Недостаточно прав для данной операции' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(VALIDATION_ERROR_CODE).send({
          message: 'Некорректный id карточки',
        });
      }

      return res.status(500).send({ message: err.message });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой карточки нет' });
      }

      if (!link) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Не передано поле link' });
      }

      if (!name) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Не передано поле name' });
      }

      return res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === VALIDATION_ERROR) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Не удалось создать карточку' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой карточки нет' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        return res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Такой карточки нет' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === CAST_ERROR) {
        return res.status(VALIDATION_ERROR_CODE).send({ message: 'Некорректные данные' });
      }
      return res.status(500).send({ message: err.message });
    });
};
