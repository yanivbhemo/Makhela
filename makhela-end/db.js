const mongoose = require('mongoose');
const consts   = require('./consts');

var { DB_USER, DB_PASS } = consts;

mongoose
 .connect("mongodb+srv://" + DB_USER + ":" + DB_PASS + "@makhela-qvsh8.mongodb.net/Makhela", {useNewUrlParser: true, useUnifiedTopology: true })
 .then(() => console.log('connected'))
 .catch(err => console.log(`connection error: ${err}`));
