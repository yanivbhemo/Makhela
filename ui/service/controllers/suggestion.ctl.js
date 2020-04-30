const mongoose = require('mongoose')
const Suggestion = require('../models/suggestion')

exports.getSize = (req, res) => {
    Suggestion.find({}).countDocuments(function(err, count) {
        if(!err) {
            console.log(count)
            return res.json(count)
        }
        else return res.json(count)
    })
}