const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => 
  {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    // accept the file
    cb(null, true);
  } else {
    // reject the file
    cb(null, false);
  }
}

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
});

const Product = require('../models/product')

// .get() it's the method that handles the GET requests. First param it says which subroute to handle and the second one it's a handler
router.get('/', (req, res, next) => {
  // .select accepts the exactly fields that you want to fetch
  Product.find()
    .select("_id name price productImage")
    .exec()
    .then(results => {
      const response = {
        count: results.length,
        products: results.map(r => {
          return {
            _id: r._id,
            name: r.name,
            price: r.price,
            productImage: r.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + r._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: err
      });
    });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
    console.log(req.file)
  // console.log(req.file)  // console.log(req.file) --> see the uploaded file/image
  if (!req.file){
    res.status(500).json({
      message: "Image extension not accepted",
    })
  }
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      productImage: req.file.path
    });

  product
    .save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Handling POST requests to /products = Created a new product succesfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          productImage: result.productImage,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result._id,
          }
        }
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
    .select("_id name price productImage")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "Not a valid entry found for provided ID"
        });
      }
      res.status(200).json({
        product: doc,
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + doc._id
        }
      });
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
  console.log(res)

  for(const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id
        }
      })
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
      res.status(200).json({
        message: "Product deleted",
        request: {
          type: "GET",
          url: "http://localhost:3000/products"
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: err})
    })
});

module.exports = router;
