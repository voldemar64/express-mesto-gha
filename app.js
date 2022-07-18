const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { NOTFOUND_ERROR_STATUS } = require('./utils/errors');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '62d1adf8d857a9f8d74330e6',
  };

  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb', () => {
  console.log('База данных подключена');
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (_req, res) => {
  res.status(NOTFOUND_ERROR_STATUS).send({ message: 'Страница не найдена' });
});

app.listen(PORT, () => {
  console.log(`Порт: ${PORT}`);
});
