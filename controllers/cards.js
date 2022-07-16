const Cards = require('../models/cards');

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
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(400).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.status(500).send({ message: 'Не удалось добавить карточку.' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;
  Cards.create({ name, link, owner: ownerId })
    .then((card) => res.status(200).send({ card }))
    .catch((err) => {
      if (err.statusCode === 400) {
        res.status(400).send({ message: 'Переданы некорректные данные для карточки.' });
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
      if (err.statusCode === 400) {
        res.status(400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
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
      if (err.statusCode === 400) {
        res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: 'Передан несуществующий _id карточки.' });
      } else {
        res.status(500).send({ message: 'Не удалось дизлайкнуть карточку.' });
      }
    });
};
