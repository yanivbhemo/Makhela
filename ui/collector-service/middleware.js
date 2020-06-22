const jwt = require('jsonwebtoken');
const {JSON_TOKEN_SECRET} = require('./consts');

module.exports = {
  withAuth: (req, res, next) => {
      const {token} = req.body;
      if (!token) {
          res.status(401).send('Unauthorized: No token provided');
        } else {
          jwt.verify(token, JSON_TOKEN_SECRET, function(err, decoded) {
            if (err) {
              console.log(err)
              res.status(401).send('Unauthorized: Invalid token');
            } else {
              req.username = decoded.username;
              next();
            }
          });
        }
  },
  withAuthToken: (req, res, next) => {
    const {token} = req.params;
    if (!token) {
        res.status(401).send('Unauthorized: No token provided');
      } else {
        jwt.verify(token, JSON_TOKEN_SECRET, function(err, decoded) {
          if (err) {
            console.log(err)
            res.status(401).send('Unauthorized: Invalid token');
          } else {
            req.username = decoded.username;
            next();
          }
        });
      }
}
}