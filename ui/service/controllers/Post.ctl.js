const mongoose = require('mongoose')
const Post = require('../models/Post')

exports.getSize = (req, res) => {
    Post.find({}).countDocuments(function(err, count) {
        if(!err) {
            console.log(count)
            return res.json(count)
        }
        else return res.json(count)
    })
}

exports.getLeaderPosts = (req, res) => {
    console.log("- Request: get the posts of a leader")
    let leader_twitter_id = req.params.twitter_id
    Post.find({leader_twitter_id}).sort({"date_created": -1}).limit(20)
    .then(docs => {
        if(docs){
            return res.status(200).json(docs)
        } else {
            return res.sendStatus(404)
        }
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
}