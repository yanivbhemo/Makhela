var mongoose = require('mongoose')

var keyword = new mongoose.Schema({
    word: {type: String, required: true, index: 1 },
    internal_create_date: {type: Date, required: true}
}, { collection: 'keywords', versionKey: ''} )

var Keyword = mongoose.model('Keyword', keyword)

module.exports = Keyword;