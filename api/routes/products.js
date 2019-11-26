const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Product = require('../models/product')

// .get() it's the method that handles the GET requests. First param it says which subroute to handle and the second one it's a handler
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET requests to /products'
  });
});

router.post('/', (req, res, next) => {
  
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  product
    .save()
    .then(res => console.log(res))
    .catch(error => console.log(("This is the error" + error)));

  res.status(200).json({
    message: "Handling POST requests to /products",
    product
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  if(id === 'coat'){
    res.status(200).json({
      message: 'Coat product',
      id
    });
  } else {
    res.status(200).json({
      message: 'Other product id'
    });
  }
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Updated product'
  })
});

router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Delete product'
  })
});

module.exports = router;
