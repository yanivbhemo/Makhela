const mongoose = require('mongoose')
const Leader = require('../models/opinion-leader')

exports.getSize = (req, res) => {
    Leader.find({}).countDocuments(function(err, count) {
        if(!err) {
            console.log(count)
            return res.json(count)
        }
        else return res.json(count)
    })
}

exports.getAllLeaders = (req, res) => {
    Leader.find({}).limit(10)
    .then( docs => {
        return res.status(200).json(docs)
    })
    .catch(err => {
        console.log(err)
    })
}

exports.MoveToBlackList = (req, res) => {
    console.log(req.params.twitter_id)
    res.status(200).send("OK")
}