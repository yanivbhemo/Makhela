const mongoose = require('mongoose')
const Topic = require('../models/Topics')

const splitToTopics = str =>{
    return str.split("(").slice(1)
}

const splitToCommunities = str =>{
    return str.split(":").slice(1)
}

const splitToWords = str =>{
    let topic = []
    let split = str.split('"').slice(1)
    for(let i=0; i<split.length; i++)
        if(i%2==0)
            topic.push(split[i])
    return topic
}

const returnThreeTopics = str =>{
    let topics = splitToTopics(str)
    let topicsParsed = []
    topics.map(topic => {
        topicsParsed.push(splitToWords(topic))
    })
    return topicsParsed
}



exports.getTopics = (req, res) => {


    let queryDate = new Date("2020-05-22T20:14:16.171Z")
    // console.log(queryDate)
    Topic.find({})
        .then(docs => { 
            let data = []
            docs.map(doc => {
                let item = {}
                item._id = doc._id
                item.date = doc.date
                item.network = returnThreeTopics(doc.network)

                let communityTopics = []
                let communities = splitToCommunities(doc.communities)
                communities.map(community => {
                    communityTopics.push(returnThreeTopics(community))
                })
                item.communities = communityTopics
                data.push(item)
        })
            // console.log(data)
            return res.json(data);
        })
        .catch(err => console.log(`query error: ${err}`))
}

