const User = require('../models/user');
const {
  SERVER_ERROR_STATUS,
  NOTFOUND_ERROR_STATUS,
  VALIDATION_ERROR_STATUS,
} = require('../utils/errors');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch(() => res.status(SERVER_ERROR_STATUS).send({ message: 'Список пользователей не получен.' }));
};

module.exports.getCurrentUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUND_ERROR_STATUS).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_STATUS).send({ message: 'Передан некорректный _id пользователя.' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_STATUS).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.patchUser = (req, res) => {
  const ownerId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(ownerId, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUND_ERROR_STATUS).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_STATUS).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_STATUS).send({ message: 'Передан некорректный _id пользователя.' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: 'Произошла неизвестная ошибка.' });
    });
};

module.exports.patchAvatar = (req, res) => {
  const ownerId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(ownerId, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(NOTFOUND_ERROR_STATUS).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(VALIDATION_ERROR_STATUS).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err.name === 'CastError') {
        return res.status(VALIDATION_ERROR_STATUS).send({ message: 'Передан некорректный _id пользователя.' });
      }
      return res.status(SERVER_ERROR_STATUS).send({ message: 'Произошла неизвестная ошибка.' });
    });
};
