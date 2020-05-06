const jwt = require('jsonwebtoken');
const {JSON_TOKEN_SECRET} = require('./consts');

module.exports = {
  withAuth: (req, res, next) => {
      const token = req.cookies.token;
      if (!token) {
          res.status(401).send('Unauthorized: No token provided');
        } else {
          jwt.verify(token, JSON_TOKEN_SECRET, function(err, decoded) {
            if (err) {
              res.status(401).send('Unauthorized: Invalid token');
            } else {
              req.username = decoded.username;
              next();
            }
          });
        }
  },
  withAuth2: (req, res, next) => {
    const token = req.body.token || '';
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
      } else {
        jwt.verify(token, JSON_TOKEN_SECRET, function(err, decoded) {
          if (err) {
            res.status(401).send('Unauthorized: Invalid token');
          } else {
              console.log("decode: " , decoded);
            req.email = decoded.email;
            next();
          }
        });
      }
  },
  withAuth3: (req, res, next) => {
    res.status(200).send("ok")
  }
}