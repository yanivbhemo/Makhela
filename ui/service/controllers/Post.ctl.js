const mongoose = require('mongoose')
const Post = require('../models/Post')
const natural = require('natural');

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

exports.getAllLeaderPosts = (req, res) => {
    console.log("- Request: get all the posts of a leader")
    let leader_twitter_id = req.params.twitter_id
    Post.find({leader_twitter_id}).sort({"date_created": -1})
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

exports.getPostsWords = (req, res) => {
    const { question } = req.body
    natural.PorterStemmer.attach();
    const words = question.tokenizeAndStem()
    let resWords = []
    Post.find({})
    .then(docs => {
        if(docs){
            docs.map(
                doc =>{
                   let docWords = doc.full_text.tokenizeAndStem()
                   let found = []
                   words.map(word => {
                    if(docWords.includes(word))
                        found.push(word)
                    })
                    if(found.length)
                        resWords.push({
                            id: doc._id,
                            postId: doc.post_id,
                            fullText: doc.full_text,
                            likes: doc.likes,
                            retweetCount: doc.retweet_count,
                            word: found,
                            date: doc.date_created,
                            leader: doc.leader_twitter_id
                        })
                }
            )
            return res.json({found: resWords, words: words })
        } else {
            return res.sendStatus(404)
        }
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
}