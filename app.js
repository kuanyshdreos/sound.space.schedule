const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'schedule-db';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.error(err);

  const db = client.db(dbName);
  const scheduleCollection = db.collection('schedule');

  // Загрузка главной страницы
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
  });

  // Получение всех записей из расписания
  app.get('/schedule', (req, res) => {
    scheduleCollection.find().toArray((err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result);
    });
  });

  // Добавление новой записи в расписание
  app.post('/schedule', (req, res) => {
    const { date, status } = req.body;
    const newEntry = { date, status };

    scheduleCollection.insertOne(newEntry, (err, result) => {
      if (err) return res.status(500).send(err);
      res.send(result.ops[0]);
    });
  });

  // Запуск сервера
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
