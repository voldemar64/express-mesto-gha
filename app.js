const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { NOTFOUND_ERROR_STATUS } = require('./utils/errors');
const { login, createUser } = require('./controllers/users');
const { signinValidation, signupValidation } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const errorHandler = require('./middlewares/errors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', signinValidation, login);
app.post('/signup', signupValidation, createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use(errors());
app.use(errorHandler);

mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('База данных подключена');
});

app.use('*', (_req, res) => {
  res.status(NOTFOUND_ERROR_STATUS).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});
