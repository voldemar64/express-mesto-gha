const Cards = require('../models/cards');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.send({ cards }))
    .catch(() => res.status(500).send({ message: 'Карточки не получены.' }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params.id;
  Cards.findByIdAndRemove(cardId)
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        throw new NotFoundError('Карточка не найдена.');
      } else {
        res.status(500).send({ message: 'Не удалось удалить карточку.' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;
  Cards.create({ name, link, owner: ownerId })
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные для карточки.');
      } else {
        res.status(500).send({ message: 'Не удалось добавить карточку.' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const ownerId = req.user._id;
  Cards.findByIdAndUpdate(
    ownerId,
    { $addToSet: { likes: ownerId } },
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные для карточки.');
      } else if (err.name === 'NotFoundError') {
        throw new NotFoundError('Карточка не найдена.');
      } else {
        res.status(500).send({ message: 'Не удалось лайкнуть карточку.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const ownerId = req.user._id;
  Cards.findByIdAndUpdate(
    ownerId,
    { $pull: { likes: ownerId } },
    { new: true },
  )
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные для карточки.');
      } else if (err.name === 'NotFoundError') {
        throw new NotFoundError('Карточка не найдена.');
      } else {
        res.status(500).send({ message: 'Не удалось дизлайкнуть карточку.' });
      }
    });
};
