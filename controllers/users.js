const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch(() => res.status(500).send({ message: 'Список пользователей не получен.' }));
};

module.exports.getCurrentUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new Error();
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.statusCode === 404) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
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
      if (err.statusCode === 400) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
      }
    });
};

module.exports.patchUser = (req, res) => {
  const { userId } = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { new: true })
    .then((user) => {
      if (!user) {
        throw new Error();
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      } else if (err.statusCode === 404) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
      }
    });
};

module.exports.patchAvatar = (req, res) => {
  const { userId } = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar }, { new: true })
    .then((user) => {
      if (!user) {
        throw new Error();
      }
      res.status(200).send({ user });
    })
    .catch((err) => {
      if (err.statusCode === 400) {
        res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      } else if (res.statusCode === 404) {
        res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      } else {
        res.status(500).send({ message: 'Произошла неизвестная ошибка.' });
      }
    });
};
