const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(500).send({ message: 'Список пользователей не получен.' }));
};

module.exports.getCurrentUser = (req, res) => {
  const { userId } = req.params.id;
  User.findById(userId)
    .then((user) => res.send({ user }))
    .catch(() => res.status(500).send({ message: 'Пользователь не найден.' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ user }))
    .catch(() => res.status(500).send({ message: 'Не удалось зарегистрировать пользователя.' }));
};

module.exports.patchUser = (req, res) => {
  const { userId } = req.params._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about })
    .then((user) => res.send({ user }))
    .catch(() => res.status(500).send({ message: 'Не удалось обновить данные пользователя.' }));
};

module.exports.patchAvatar = (req, res) => {
  const { userId } = req.params._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar })
    .then((user) => res.send({ user }))
    .catch(() => res.status(500).send({ message: 'Не удалось обновить аватар пользователя.' }));
};
