const mongoose = require('mongoose')
const BlackListLeader = require('../models/Blacklist')
const Leader = require('../models/opinion-leader')

exports.getSize = (req, res) => {
    BlackListLeader.find({}).countDocuments(function(err, count) {
        if(!err) {
            console.log(count)
            return res.json(count)
        }
        else return res.json(count)
    })
}

exports.getAllBlackListLeadersLimited = (req, res) => {
    const limitNum = req.body.limitNum
    BlackListLeader.find({}).sort({"internal_create_date": -1}).limit(limitNum)
    .then( docs => {
        console.log("- Request: Return all BlackListLeaders")
        return res.status(200).json(docs)
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getAllBlackListLeaders = (req, res) => {
    BlackListLeader.find({}).sort({"internal_create_date": -1}).limit(50)
    .then( docs => {
        console.log("- Request: Return all BlackListLeaders")
        return res.status(200).json(docs)
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getBlackListLeadersByRange = (req, res) => {
    var start_index = req.body.start
    var end_index = req.body.end
    BlackListLeader.find({}).countDocuments(function(err, count) {
        if(!err) {
            if(end_index < count) {
                console.log(end_index)
                // you can process it
                BlackListLeader.find({$and: [{"native_id": {$gte: start_index}},{"native_id": {$lt: end_index}}]}).sort({"internal_create_date": -1})
                .then( docs => {
                    console.log(docs.length)
                    console.log("- Request: Return BlackListLeaders by range")
                    return res.status(200).json(docs)
                })
                .catch(err => {
                    console.log(err)
                    return res.sendStatus(403)
                })
            } else {
                return res.sendStatus(404)
            }
        } else {
            return res.sendStatus(403)
        }
    })
}

exports.getLocations = (req, res) => {
    BlackListLeader.find({}, 'twitter_location').distinct('twitter_location')
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

exports.moveToCommunity = (req, res) => {
    const twitter_screen_name = req.params.twitter_screen_name
    var new_id;
    console.log(`Move the following twitter id into the community: ${twitter_screen_name}`)
    BlackListLeader.findOne({twitter_screen_name})
    .then( doc => {
        console.log(doc)
        Leader.findOne({}).sort({"native_id": -1}).limit(1)
        .then(last_doc => {
            let swap = new Leader({
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
                community_following: [],
                lock: doc.lock,
                twitter_profile_image: doc.twitter_profile_image,
                internal_create_date: doc.internal_create_date,
                community: doc.community,
                deg_centrality: doc.deg_centrality,
                betweenness_centrality: doc.betweenness_centrality,
                closeness_centrality: doc.closeness_centrality,
                analyzed_date: doc.analyzed_date,
                native_id: new_id
            })
            swap.save((err, result) => {
                if(err){
                    console.log(err)
                    return res.sendStatus(404)
                }
                else {
                    doc.remove((err, result) => {
                        if(err){
                            console.log(err)
                            return res.sendStatus(404)
                        } else {
                            return res.sendStatus(200)
                        }       
                    })
                }
            })
        })
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getBlackListLeadersByLocation = (req, res) => {
    console.log("- Request: Get all BlackListLeaders from specific location")
    const location = req.params.location
    console.log(location)
    BlackListLeader.find({"twitter_location": { $regex: ".*"+location+".*", $options: 'i'}})
    .then( docs => {
        console.log(docs)
        return res.status(200).json(docs)
    })
    .catch(err => {
        console.log(err)
    })
}

exports.getBlackListLeader = (req, res) => {
    console.log(req)
    console.log("- Request: Get information of BlackListLeader " + req.params.twitter_screen_name)
    let query
    if(req.params.twitter_screen_name.match(/^[0-9]+$/))
    {
        let twitter_id = req.params.twitter_screen_name
        query={twitter_id}
    }
    else{
        let twitter_screen_name = req.params.twitter_screen_name
        query={twitter_screen_name}
    }

    BlackListLeader.findOne(query)
    .then(doc => {
        if(doc){
            return res.status(200).json(doc)
        } else {
            return res.sendStatus(404)
        }
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(500)
    })
}

exports.getBlackListLeaderFriends = (req, res) => {
    console.log("- Request: Get BlackListLeader's friends inside the community: " + req.params.twitter_id)
    let twitter_id = req.params.twitter_id
    BlackListLeader.findOne({twitter_id}).select('community_following')
    .then(docs => {
        console.log(docs)
        if(docs){
            return res.status(200).json(docs)
        } else {
            return res.sendStatus(404)
        }
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(500)
    })
}

exports.getBlackListLeaderShortDetails = (req, res) => {
    console.log("- Request: Get BlackListLeader's information short version")
    let twitter_id = req.params.twitter_id
    BlackListLeader.findOne({twitter_id}).select('full_name twitter_screen_name twitter_profile_image')
    .then(doc => {
        if(!doc) {
            payload = {"full_name": "none", "twitter_screen_name": "none", "twitter_profile_image": "none"}
            return res.status(200).json(payload)
        } else
            return res.status(200).json(doc)
    })
    .catch(err => {
        console.log(err)
        return res.sendStatus(500)
    })
}