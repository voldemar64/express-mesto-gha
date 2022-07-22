const Cards = require('../models/cards');

const ValidationError = require('../errors/ValidationError');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

module.exports.getCards = (req, res, next) => {
  Cards.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  const { id } = req.params;
  Cards.findById(id)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с указанным id не найдена.');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new Forbidden('Невозможно удалить чужую карточку.');
      }
      Cards.findByIdAndRemove(id)
        .then(() => res.send({ data: card }))
        .catch(() => {
          throw new Error('Неизвестная ошибка.');
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Передан некорректный _id карточки.');
      }

      throw new Error('Неизвестная ошибка.');
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

      throw new Error('Неизвестная ошибка.');
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { id } = req.params;
  Cards.findByIdAndUpdate(
    id,
    { $addToSet: { likes: ownerId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Передан несуществующий _id карточки.');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Передан некорректный _id карточки.');
      }

      throw new Error('Неизвестная ошибка.');
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { id } = req.params;
  Cards.findByIdAndUpdate(
    id,
    { $pull: { likes: ownerId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFound('Передан несуществующий _id карточки.');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Передан некорректный _id карточки.');
      }

      throw new Error('Неизвестная ошибка.');
    })
    .catch(next);
};
