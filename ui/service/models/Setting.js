var mongoose = require('mongoose')

var setting = new mongoose.Schema({
    attribute: {type: String, required: true, index: 1 },
    value: {type: String, required: true}
}, { collection: 'settings', versionKey: ''} )

var Setting = mongoose.model('Setting', setting)

module.exports = Setting