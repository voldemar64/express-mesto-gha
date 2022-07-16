const Cards = require('../models/cards');
const ValidationError = require('../errors/ValidationError');
const NotFound = require('../errors/NotFound');

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.status(200).send({ cards }))
    .catch(() => res.status(500).send({ message: 'Карточки не получены.' }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        throw new Error();
      }
      res.status(200).send({ card });
    })
    .catch(() => res.status(500).send({ message: 'Не удалось удалить карточку.' }));
};

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;
  Cards.create({ name, link, owner: ownerId })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные для карточки.');
        res.status(error.statusCode).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'Не удалось добавить карточку.' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  Cards.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: ownerId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error();
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные для карточки.');
        res.status(error.statusCode).send({ message: error.message });
      } else if (err.name === 'NotFound') {
        const error = new NotFound('Карточка не найдена.');
        res.status(error.statusCode).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'Не удалось лайкнуть карточку.' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  const ownerId = req.user._id;
  const { cardId } = req.params;
  Cards.findByIdAndUpdate(
    cardId,
    { $pull: { likes: ownerId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new Error();
      }
      res.status(200).send({ card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные для карточки.');
        res.status(error.statusCode).send({ message: error.message });
      } else if (err.name === 'NotFound') {
        const error = new NotFound('Карточка не найдена.');
        res.status(error.statusCode).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'Не удалось дизлайкнуть карточку.' });
      }
    });
};
