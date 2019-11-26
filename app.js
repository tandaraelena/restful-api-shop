const express = require('express');
const app = express();
const morgan = require('morgan');

const productsRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')

app.use(morgan('dev'))

// setup a midlleware and here every request it's finaled to
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes)

module.exports = app;