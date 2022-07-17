const Cards = require('../models/cards');
const {
  SERVER_ERROR_STATUS,
  NOTFOUND_ERROR_STATUS,
  VALIDATION_ERROR_STATUS,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Cards.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(() => res.status(SERVER_ERROR_STATUS).send({ message: 'Карточки не получены.' }));
};

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Cards.findByIdAndRemove(cardId)
    .then((card) => {
      if (!card) {
        return res.status(NOTFOUND_ERROR_STATUS).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_STATUS).send({ message: 'Передан некорректный _id карточки.' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: 'Не удалось удалить карточку.' });
    });
};

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;
  Cards.create({ name, link, owner: ownerId })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_STATUS).send({ message: 'Переданы некорректные данные для карточки.' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: 'Не удалось добавить карточку.' });
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
        return res.status(NOTFOUND_ERROR_STATUS).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_STATUS).send({ message: 'Передан некорректный _id карточки.' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: 'Не удалось лайкнуть карточку.' });
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
        return res.status(NOTFOUND_ERROR_STATUS).send({ message: 'Передан несуществующий _id карточки.' });
      }
      return res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_STATUS).send({ message: 'Передан некорректный _id карточки.' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: 'Не удалось дизлайкнуть карточку.' });
    });
};
