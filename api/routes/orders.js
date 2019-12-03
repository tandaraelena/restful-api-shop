const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')

const Order = require('../models/order')

// .get() it's the method that handles the GET requests. 
// First param it says which subroute to handle and the second one it's a handler
router.get('/', (req, res, next) => {
  Order.find()
    .select("_id quantity")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(r => ({
          orderId: r._id,
          orderQuantity: r.quantity,
        }))
      })
    })
    .catch(err => res.status(500).json({error: err}))
});

router.post('/', (req, res, next) => {
  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    quantity: req.body.quantity,
    product: req.body.productId
  });

  order.save()
    .then(result => {
      console.log(result)
      res.status(201).json(result)
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
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
