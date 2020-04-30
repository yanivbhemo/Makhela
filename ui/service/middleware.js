const jwt = require('jsonwebtoken');
const {JSON_TOKEN_SECRET} = require('./consts');

module.exports = {
  withAuth: (req, res, next) => {
      const token = req.cookies.token;
      console.log(token)
      if (!token) {
          console.log("test1")
          res.status(401).send('Unauthorized: No token provided');
        } else {
          console.log("test2")
          jwt.verify(token, JSON_TOKEN_SECRET, function(err, decoded) {
            if (err) {
              console.log("test3")
              res.status(401).send('Unauthorized: Invalid token');
            } else {
              console.log("test4")
              req.username = decoded.username;
              console.log()
              next();
            }
          });
        }
  },
  withAuth2: (req, res, next) => {
    console.log("tessssttt")
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
    console.log("hey 3")
    res.status(200).send("ok")
  }
}