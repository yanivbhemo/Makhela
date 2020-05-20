const mongoose = require('mongoose')
const BlackListLeader = require('../models/Blacklist')
const Leader = require('../models/opinion-leader')
const Post = require('../models/Post')
const Suggestion = require('../models/suggestion')
const Keyword = require('../models/Keyword')

exports.initSystem = (req, res) => {
    console.log("I am here")
    return res.sendStatus(200)
}