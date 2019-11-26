const express = require('express');
const router = express.Router();

// .get() it's the method that handles the GET requests. 
// First param it says which subroute to handle and the second one it's a handler
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET requests to /orders'
  });
});

router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity
  };
  res.status(201).json({
    message: "Handling POST requests to /orders",
    order
  });
});

router.get('/:orderId', (req, res, next) => {
  const orderId = req.params.orderId;
  if (orderId === 'order-id-1'){
    res.status(201).json({
      message: 'Get the order by id---> Order details',
      orderId
    })
  } else {
    res.status(200).json({
      message: 'Any other id'
    })
  }
})

router.delete('/:orderId', (req, res, next) => {
  const orderId = req.params.orderId;
  res.status(200).json({
    message: 'Order deleted',
    orderId
  })
})

module.exports = router;
