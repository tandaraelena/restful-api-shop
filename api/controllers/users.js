const User = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

exports.users_get_all = (req, res, next) => {
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
};

exports.users_post_signup = (req, res, next) => {
  // before storing a new user check if the email add exists in db
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
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
};

exports.users_post_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(users => {
      if (users.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        })
      }
      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
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
};

exports.users_delete_one = (req, res, next) => {
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
};