const express = require('express');
const app = express();
const morgan = require('morgan');

const productsRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')

app.use(morgan('dev'))

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