const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postRoutes = require('./routes/posts');
const app = express();


mongoose.connect('mongodb://localhost:27017/node-angular', { useNewUrlParser: true })
.then(() => {
  console.log('Connected to database!');
})
.catch(() => {
  console.log('Error connecting to database!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
  'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods',
  'GET, POST, DELETE, OPTIONS, PATCH, PUT');
  next();
});
app.use('/api/posts', postRoutes);


module.exports = app;
