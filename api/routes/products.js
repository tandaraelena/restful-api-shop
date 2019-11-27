const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Product = require('../models/product')

// .get() it's the method that handles the GET requests. First param it says which subroute to handle and the second one it's a handler
router.get('/', (req, res, next) => {
  // .select accepts the exactly fields that you want to fetch
  Product.find()
    .select("name price _id")
    .exec()
    .then(results => {
      const response = {
        count: results.length,
        products: results.map(r => {
          return {
            name: r.name,
            price: r.price,
            _id: r._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + r._id
            }
          }
        })
      }
      res.status(200).json(response);
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
      res.status(200).json({
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
  const id = req.params.productId;
  const updateOps = {};

  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result)
    })
    .catch(err => {
      console.log(err);
      res.status(400).json({message: err})
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
