const mongoose = require('mongoose')
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const consts = require('../consts');

exports.createUser = (req, res) => {
  console.log("- Request: Create new user")
    const { full_name, email, username, password, role } = req.body;
    User.findOne({email})
    .then(doc => {
      if(doc){
        return res.sendStatus(403)
      } else{
          const user = new User({ full_name, email, username, password, role });
          user.save(function(err) {
            if (err) {
              return res.status(500)
                .send("Error registering new user please try again.");
            } else {
                return res.status(200).send("Welcome to the club!");
            }
          });
      }
    })
    .catch(err => {
      console.log(err)
      return res.sendStatus(401)
    })
}

exports.deleteUser = (req, res) => {
  const email = req.body.email;
  console.log("- Request: Delete user", email)
  User.deleteOne({email})
  .then((result)=>{
    if(result.deletedCount === 1)
      return res.sendStatus(200)
    else return res.sendStatus(401)
  })
  .catch(err => {
    console.log(err)
    return res.sendStatus(401)
  })
}

exports.updateUser = (req, res) => {
  const { full_name, email, username, password, role } = req.body;
  console.log("- Request: Update user", username)
  User.updateOne({email},{full_name,email,username,password,role})
  .then((result)=>{
    if(result.ok === 1)
      return res.sendStatus(200)
    else
      return res.sendStatus(401)
  })
  .catch(err => {
    console.log(err)
    return res.sendStatus(401)
  })
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
                    const token = jwt.sign(payload, consts.JSON_TOKEN_SECRET);
                    console.log("Token: ", token)
                    let response = {token, full_name, user_role}
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

exports.getAllUsers = (req, res) => {
  console.log("- Request: Get all users")
  User.find()
  .then(docs => {
    return res.status(200).json(docs)
  })
  .catch(err => {
    console.log(err)
    return res.sendStatus(401)
  })
}