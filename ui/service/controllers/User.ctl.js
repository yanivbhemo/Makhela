const mongoose = require('mongoose')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const consts = require('../consts');

exports.createUser = (req, res) => {
    const { full_name, email, username, password, role } = req.body;
    const user = new User({ full_name, email, username, password, role });
    user.save(function(err) {
      if (err) {
        res.status(500)
          .send("Error registering new user please try again.");
      } else {
        res.status(200).send("Welcome to the club!");
      }
    });
}

exports.authenticate2 = (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username }, function(err, user) {
    if (err) {
      console.error(err);
      res.status(500)
        .json({
        error: 'Internal error please try again'
      });
    } else if (!user) {
      res.status(401)
        .json({
          error: 'Incorrect email or password'
        });
      } else {
          user.isCorrectPassword(password, function(err, same) {
            if (err) {
              res.status(500)
                .json({
                  error: 'Internal error please try again'
              });
            } else if (!same) {
              res.status(401)
                .json({
                  error: 'Incorrect email or password'
              });
            } else {
              user.isCorrectPassword(password, function(err, same) {
                if (err) {
                  res.status(500)
                    .json({
                      error: 'Internal error please try again'
                  });
                } else if (!same) {
                  res.status(401)
                    .json({
                      error: 'Incorrect email or password'
                  });
                } else {
                  // Issue token
                  // Get role
                  User.findOne({username}, (err, data) => {
                    let user_role = data.role
                    let full_name = data.full_name
                    const payload = { username, user_role, full_name };
                    const token = jwt.sign(payload, consts.JSON_TOKEN_SECRET, {
                      expiresIn: '1h'
                    });
                    console.log("Token: ", token)
                    let response = {token, full_name}
                    res.status(200).json(response)
                  })
                }
              });
          }
  })
}})}


exports.authenticate = (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username }, function(err, user) {
        if (err) {
            console.error(err);
            res.status(500)
              .json({
              error: 'Internal error please try again'
            });
          } else if (!user) {
            res.status(401)
              .json({
                error: 'Incorrect email or password'
              });
            } else {
                user.isCorrectPassword(password, function(err, same) {
                  if (err) {
                    res.status(500)
                      .json({
                        error: 'Internal error please try again'
                    });
                  } else if (!same) {
                    res.status(401)
                      .json({
                        error: 'Incorrect email or password'
                    });
                  } else {
                    // Issue token
                    // Get role
                    User.findOne({username},'role', (err, data) => {
                      let user_role = data.role
                      const payload = { username, user_role };
                      const token = jwt.sign(payload, consts.JSON_TOKEN_SECRET, {
                        expiresIn: '1h'
                      });
                      res.cookie('token', token, { httpOnly: true })
                        .sendStatus(200);
                    })
                  }
                });
            }
    })
}