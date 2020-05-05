const mongoose = require('mongoose')
const Leader = require('../models/opinion-leader')
const BlackListLeader = require('../models/Blacklist')

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
        console.log("- Request: Return all leaders")
        return res.status(200).json(docs)
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getLocations = (req, res) => {
    Leader.find({}, 'twitter_location').distinct('twitter_location')
    .then( docs => {
        var newDocs = []
        docs.forEach(item => {
            item = item.toLowerCase()
            item = item.split(",")[0]
            item = item.trim()
            newDocs.push(item)
        })
        newDocs = newDocs.filter((v, i, a) => a.indexOf(v) === i)
        console.log("- Request: Return all locations")
        return res.status(200).json(newDocs)
    })
    .catch(err => {
        console.log(err)
    })
}

exports.MoveToBlackList = (req, res) => {
    const twitter_id = req.params.twitter_id
    console.log(`Move the following twitter id to blacklist: ${twitter_id}`)
    Leader.findOne({twitter_id})
    .then( doc => {
        let swap = new BlackListLeader({
            full_name: doc.full_name,
            new_leader: doc.new_leader,
            twitter_created_at: doc.twitter_created_at,
            twitter_description: doc.twitter_description,
            twitter_followers_count: doc.twitter_followers_count,
            twitter_friends_count: doc.twitter_friends_count,
            twitter_id: doc.twitter_id,
            twitter_location: doc.twitter_location,
            twitter_screen_name: doc.twitter_screen_name,
            twitter_statuses_count: doc.twitter_statuses_count,
            level_of_certainty: doc.level_of_certainty,
            community_following: doc.community_following,
            lock: doc.lock,
            twitter_profile_image: doc.twitter_profile_image,
            internal_create_date: doc.internal_create_date,
            community: doc.community,
            deg_centrality: doc.deg_centrality,
            betweenness_centrality: doc.betweenness_centrality,
            closeness_centrality: doc.closeness_centrality,
            analyzed_date: doc.analyzed_date
        })
        swap.save((err, result) => {
            if(err){
                console.log(err)
                res.sendStatus(404)
            }
            else {
                console.log(result)
                doc.remove()
                res.sendStatus(200)
            }
        })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getLeadersByLocation = (req, res) => {
    console.log("- Request: Get all leaders from specific location")
    const location = req.params.location
    console.log(location)
    Leader.find({"twitter_location": { $regex: ".*"+location+".*", $options: 'i'}})
    .then( docs => {
        console.log(docs)
        return res.status(200).json(docs)
    })
    .catch(err => {
        console.log(err)
    })
}