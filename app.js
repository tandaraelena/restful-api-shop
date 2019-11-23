const express = require('express');
const app = express();

// setup a midlleware
app.use((req, res, next) => {
  res.status(200).json({
    message: 'Works!!!'
  });
});

module.exports = app;