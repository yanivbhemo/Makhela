const mongoose = require('mongoose');
// const consts = require('./consts');


let db_username = "sveta";
let db_password = "Makhela123";


// db = MongoClient("mongodb+srv://" + db_username + ":" + db_password + "@makhela-qvsh8.mongodb.net/Makhela")

mongoose
 .connect("mongodb+srv://" + db_username + ":" + db_password + "@makhela-qvsh8.mongodb.net/Makhela")
 .then(() => console.log('connected'))
 .catch(err => console.log(`connection error: ${err}`));
