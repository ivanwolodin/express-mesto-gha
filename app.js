const express = require('express');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const { NOT_FOUND_ERROR_CODE } = require('./utils/utils');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).json({
    message: 'Нет такой страницы',
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
