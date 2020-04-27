const mongoose = require('mongoose')
const Post = require('../models/Post')

exports.getSize = (req, res) => {
    Post.find({}).count(function(err, count) {
        if(!err) {
            console.log(count)
            return res.json(count)
        }
        else return res.json(count)
    })
}