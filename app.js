const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const productsRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')

// use morgan to easily log errors and body-parser to extract data and parse 
// into the format that's easier for us to read (json and urlencoded)
app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// routes which will handle the requests 
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes)

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
})

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  })
})

module.exports = app;