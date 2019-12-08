const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productsRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')
const usersRoutes = require('./api/routes/users')

// use morgan to easily log errors and body-parser to extract data and parse 
// into the format that's easier for us to read (json and urlencoded)
app.use(morgan('dev'));
// this middleware will make the uploads folder available to everywhere
// http://localhost:3000/uploads/0001.jpg
app.use("/uploads", express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

mongoose.connect(
  "mongodb+srv://tandaraelena:" +
    process.env.MONGODB_PASSWORD +
    "@nodejs-shop-34dzq.mongodb.net/test?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

mongoose.Promise = global.Promise;

// Cross-Origin Resource Sharing = is a mechanism that uses additional HTTP headers to 
// tell browsers to allow the web app at one origin to have access to the resources from a different origin
app.use((req, res, next) => {
  // first param gives access to the server origin,
  // second one gives access to any client origin ->
  res.header('Access-Control-Allow-Origin', '*');

  // first param gives access to the server depending on the headers,
  // second one it's the list with accepted headers ->
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({})
  }
  next();
})

// routes which will handle the requests 
app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use("/users", usersRoutes);

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