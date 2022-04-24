const express = require('express');

const { PORT = 3000 } = process.env;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

app.use((req, res, next) => {
  req.user = {
    _id: '6264fde66da0277eb2ff8712',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((req, res) => {
  res.status(404).json({
    message: 'Нет такой страницы',
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
