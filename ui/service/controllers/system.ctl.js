const mongoose = require('mongoose')
const BlackListLeader = require('../models/Blacklist')
const Leader = require('../models/opinion-leader')
const Post = require('../models/Post')
const Suggestion = require('../models/suggestion')
const Keyword = require('../models/Keyword')
const System = require('../models/System')

exports.initSystem = (req, res) => {
    console.log("- Request: Initilize the data")
    console.log("Empty Leaders collection")
    Leader.deleteMany({})
    .then(()=>{
        console.log("Empty Blacklist collection")
        BlackListLeader.deleteMany({})
        .then(()=>{
            console.log("Empty Posts collection")
            Post.deleteMany({})
            .then(()=>{
                console.log("Empty Suggestions collection")
                Suggestion.deleteMany({})
                .then(()=>{
                    console.log("Empty Keywords collection")
                    Keyword.deleteMany({})
                    .then(()=>{
                        System.updateOne({attribute: "NEW_SYSTEM"}, {$set: {value: true}})
                        .then(()=>{
                            return res.sendStatus(200)
                        })
                        .catch(err => {
                            console.log(err)
                            return res.sendStatus(403)
                        })
                    })
                })
                .catch(err => {
                    console.log(err)
                    return res.sendStatus(403)
                })
            })
            .catch(err => {
                console.log(err)
                return res.sendStatus(403)
            })
        })
        .catch(err => {
            console.log(err)
            return res.sendStatus(403)
        })    
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(403)
    })    
}