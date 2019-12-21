const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

const User = require("../models/user");

router.get('/', (req,res,next) => {
  User.find()
      .exec()
      .then(results => {
        const result = results.map(r => ({
          email: r.email,
          id: r._id,
        }))
        res.status(200).json(result)
      })
      .catch(err => console.log(err))
})

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
});

router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(users => {
      if (users.length < 1){
        return res.status(401).json({
          message: "Auth failed"
        })
      }
      bcrypt.compare(req.body.password, users[0].password, (err,result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          })
        } else if (result) {
          // jwt.sign(payload, secretOrPrivateKey, [options, callback])
          const token = jwt.sign(
            { 
              email: users[0].email,
              userId: users[0]._id
            }, 
            process.env.JWT_KEY, 
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          })
        }
        return res.status(401).json({
          message: "Auth failed"
        })
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    })
})

router.delete("/:userId", (req,res,next) => {
  const id = req.params.userId;
  User.remove({ _id: id })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "User deleted"
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
})

module.exports = router;