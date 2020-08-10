const mongoose = require('mongoose');
const consts = require('../consts');

exports.connectToDatabase = (req, res) => {
    const { database_name } = req.body;
    console.log(database_name)
    const url = "mongodb://db.dev.makhela.live/"+database_name+"?retryWrites=true&w=majority"
    const options = {
        useNewUrlParser: true, // For deprecation warningsuseCreate
        useUnifiedTopology: true,
        user: "yaniv",
        pass: "Azaz123!@#",
        serverSelectionTimeoutMS:2000
    };
        mongoose.connect(url, options)   
        .then(() => {
            console.log('connected')
            return res.sendStatus(200)
        })   
        .catch(err => {
            console.log(`connection error: ${err}`)
            return res.sendStatus(404)
        });
}