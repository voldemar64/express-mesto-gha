const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(() => res.status(500).send({ message: 'Список пользователей не получен.' }));
};

module.exports.getCurrentUser = (req, res) => {
  const { userId } = req.user._id;
  User.findById(userId)
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        const error = new NotFoundError('Пользователь не найден.');
        res.status(error.statusCode).send({ message: error.message });
      } else if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные о пользователе.');
        res.status(error.statusCode).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные при создании пользователя.');
        res.status(error.statusCode).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
      }
    });
};

module.exports.patchUser = (req, res) => {
  const { userId } = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные при обновлении пользователя.');
        res.status(error.statusCode).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
      }
    });
};

module.exports.patchAvatar = (req, res) => {
  const { userId } = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const error = new ValidationError('Переданы некорректные данные при обновлении аватара.');
        res.status(error.statusCode).send({ message: error.message });
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
      }
    });
};
