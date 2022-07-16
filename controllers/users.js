const User = require('../models/user');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(500).send({ message: 'Список пользователей не получен.' }));
};

module.exports.getCurrentUser = (req, res) => {
  const { userId } = req.params.id;
  User.findById(userId)
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        throw new NotFoundError('Пользователь не найден.');
      } else if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные о пользователе.');
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при создании пользователя.');
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
      }
    });
};

module.exports.patchUser = (req, res) => {
  const { userId } = req.params._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при обновлении пользователя.');
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
      }
    });
};

module.exports.patchAvatar = (req, res) => {
  const { userId } = req.params._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new ValidationError('Переданы некорректные данные при обновлении аватара.');
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
      }
    });
};
