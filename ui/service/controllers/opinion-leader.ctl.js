const mongoose = require('mongoose')
const Leader = require('../models/opinion-leader')

exports.getSize = (req, res) => {
    Leader.find({}).count(function(err, count) {
        if(!err) {
            console.log(count)
            return res.json(count)
        }
        else return res.json(count)
    })
}