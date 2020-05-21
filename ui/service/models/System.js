var mongoose = require('mongoose')

var system = new mongoose.Schema({
    attribute: {type: String, required: true, index: 1 },
    value: {type: String, required: true}
}, { collection: 'settings', versionKey: ''} )

var System = mongoose.model('System', system)

module.exports = System