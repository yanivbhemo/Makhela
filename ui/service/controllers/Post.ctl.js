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

exports.getPostsWords = (req, res) => {
    const words = req.body.words
    console.log("words "+words)
    let resWords = []
    Post.find({})
    .then(docs => {
        if(docs){
            docs.map(
                doc =>{
                   let docWords = doc.full_text.toLowerCase().split(/\W+/)
                   let found = []
                   words.map(word => {
                    if(docWords.includes(word))
                        found.push(word)
                    })
                    if(found.length)
                        resWords.push({
                            postId: doc.post_id,
                            fullText: doc.full_text,
                            likes: doc.likes,
                            retweetCount: doc.retweet_count,
                            keyWord: doc.key_word,
                            word: found,
                            date: doc.date_created,
                            leader: doc.leader_twitter_id
                        })
                }
            )
            return res.json(resWords)
        } else {
            return res.sendStatus(404)
        }
    })
    .catch(err => {
        console.log(err)
        res.sendStatus(500)
    })
    // res.json({words: words})
}