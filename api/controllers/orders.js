const Order = require('../models/order');
const mongoose = require('mongoose');
const Product = require('../models/product')

exports.orders_get_all = (req, res, next) => {
  Order.find()
    .select("_id quantity")
    .populate("product", "name")
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(r => ({
          _id: r._id,
          quantity: r.quantity,
          product: r.product,
          request: {
            type: "GET",
            url: "http://localhost:3000/orders/" + r._id
          }
        }))
      })
    })
    .catch(err => res.status(500).json({ error: err }))
};

exports.orders_post_one = (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: "Product not found"
        })
      }
      const order = new Order({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
      });

      return order.save()
    })
    .then(result => {
      console.log(result)
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id
        }
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        message: "Product not found",
        dontWorryAboutThisUglyError: err
      })
    })
};

exports.orders_get_one = (req, res, next) => {
  const orderId = req.params.orderId;

  Order.findById(orderId)
    .populate('product')
    .exec()
    .then(order => {
      if (!order) {
        res.status(404).json({
          message: "Order not found"
        })
      }
      res.status(200).json({
        order: order,
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Order not found",
        uglyErrorSays: err
      })
    })
};

exports.orders_delete_one = (req, res, next) => {
  const orderId = req.params.orderId;
  Order.remove({ _id: orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "GET",
          url: "http://localhost:3000/orders"
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        message: "Couldn't delete your order",
        erorr: err
      })
    })
};