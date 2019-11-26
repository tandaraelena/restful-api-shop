const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Product = require('../models/product')

// .get() it's the method that handles the GET requests. First param it says which subroute to handle and the second one it's a handler
router.get('/', (req, res, next) => {
  Product.find()
    .exec()
    .then(results => {
      console.log(results);
      res.status(200).json(results);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: err
      })
    })
});

router.post('/', (req, res, next) => {
  
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });

  product
    .save()
    .then(result => {
      console.log(result);;
      result.status(200).json({
        message: "Handling POST requests to /products",
        createdProduct: result
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: error
      })
    });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if(doc){
        res.status(200).json(doc)
      } else {
        res.status(404).json({
          message: "Not a valid entry found for provided ID"
        })
      }
      res.status(200).json(doc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Updated product'
  })
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: err})
    })
});

module.exports = router;
