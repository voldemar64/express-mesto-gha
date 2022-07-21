const Cards = require('../models/cards');

const ValidationError = require('../errors/ValidationError');
const NotFound = require('../errors/NotFound');
const CastError = require('../errors/CastError');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Cards.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным _id не найдена.');
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError('Передан некорректный _id карточки.');
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;
  Cards.create({ name, link, owner: ownerId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные для карточки.');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: ownerId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Передан несуществующий _id карточки.');
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError('Передан некорректный _id карточки.');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: ownerId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Передан несуществующий _id карточки.');
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new CastError('Передан некорректный _id карточки.');
      }
    })
    .catch(next);
};
