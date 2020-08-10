const mongoose = require('mongoose');
const consts = require('./consts');

const { MLAB_URL, DB_USER, DB_PASS } = consts;
const url = MLAB_URL;
const options = {
	useNewUrlParser: true, // For deprecation warningsuseCreate
	useUnifiedTopology: true,
	user: DB_USER,
	pass: DB_PASS,
	serverSelectionTimeoutMS:2000
};

mongoose.connect(url, options)   
	.then(() => console.log('connected'))   
	.catch(err => console.log(`connection error: ${err}`));