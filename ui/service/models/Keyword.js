var mongoose = require('mongoose')

var keyWord = new mongoose.Schema({
    word: {type: String, required: true, index: 1 },
  }, { collection: 'keywords', versionKey: ''} )

var keyWord = mongoose.model('keywords', keyWord)

module.exports = keyWord