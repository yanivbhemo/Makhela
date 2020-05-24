var mongoose = require('mongoose')

var Topic = new mongoose.Schema({
    _id: Object,
    network: Object,
    communities: Object,
    date: Date
}, { collection: 'topics', versionKey: ''} )

var Topic = mongoose.model('Topic', Topic)

module.exports = Topic;
