const express = require('express');
const router = express.Router();

// .get() it's the method that handles the GET requests. First param it says which subroute to handle and the second one it's a handler
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET requests to /products'
  });
});

router.post('/', (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price
  }
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
