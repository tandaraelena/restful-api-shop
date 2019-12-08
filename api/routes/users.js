const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

router.post('/signup', (req, res, next) => {
  // before storing a new user check if the email add exists in db
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if(user.length >= 1){
        return res.status(409).json({
          message: "User exist"
        })
      } else {
        // use hash to secure the password visibility
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              message: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash
            });
            user
              .save()
              .then(user => {
                console.log(user);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                res.status(500).json({
                  message: err
                });
              });
          }
        });
      }
    })
})

module.exports = router;