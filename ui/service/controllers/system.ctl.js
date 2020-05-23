const mongoose = require('mongoose')
const BlackListLeader = require('../models/Blacklist')
const Leader = require('../models/opinion-leader')
const Post = require('../models/Post')
const Suggestion = require('../models/suggestion')
const Setting = require('../models/Setting')
const Keyword = require('../models/Keyword')

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
                        Setting.updateOne({attribute: "NEW_SYSTEM"}, {$set: {value: true}})
                        .then(()=>{
                            return res.sendStatus(200)
                        })
                        .catch(err => {
                            console.log(err)
                            return res.sendStatus(404)
                        })
                    })
                })
                .catch(err => {
                    console.log(err)
                    return res.sendStatus(404)
                })
            })
            .catch(err => {
                console.log(err)
                return res.sendStatus(404)
            })
        })
        .catch(err => {
            console.log(err)
            return res.sendStatus(404)
        })    
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(404)
    })    
}

exports.checkSystemStatus = (req, res) => {
    console.log("- Request: Check if system is formatted")
    Setting.findOne({attribute: "NEW_SYSTEM", value: true})
    .then(doc => {
        if(doc) {
            console.log("Yes")
            return res.sendStatus(200)
        } else {
            return res.sendStatus(201)
        }
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(201)
    }) 
}

exports.getAllSystemSettings = (req, res) => {
    console.log("- Request: Get all system's settings")
    Setting.find()
    .then(docs => {
        return res.status(200).json(docs)
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(404)
    })
}

exports.updateSetting = (req, res) => {
    const {attribute, value} = req.body;
    console.log("- Request: Update specific setting - " + attribute)
    Setting.updateOne({attribute}, {$set: {value: value}})
    .then(() => {
        return res.sendStatus(200)
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(404)
    })
}