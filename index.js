/* eslint-disable no-undef */
const express = require('express'),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require('mongoose'),
  logger = require('morgan'),
  http = require('http').createServer(app),
  io = require('socket.io')(http),
  controller = require('./controllers/controller');

app.use(express.json({ extended: false }));

app.use(logger('dev'));

// define routes
app.get('/new_record/:temperature/:humidity', controller.submitRecord);

app.get('/records', controller.getLatestData);


mongoose
  .connect('mongodb://127.0.0.1:27017/smartFireAlarm', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => {
    console.log(error.message);
  });

io.on('connection', () => {
  console.log('object');
});

global.io = io;

http.listen(port, () => {
  console.log(`Server started @ http://localhost:${port}`);
});
