const mongoose = require('mongoose')
const Topic = require('../models/Topics')

exports.getTopics = (req, res) => {
    
    let queryDate = new Date("2020-05-22T20:14:16.171Z")
    // console.log(queryDate)
    Topic.find({})
    // Topic.find({"date": queryDate})
    // Topic.find({"date" : { $gte : new Date("2012-01-12T20:15:31Z") }})
        .then(docs => {
            console.log(docs[0].date)
            console.log(docs[1].date)
            console.log(docs[0].date>docs[1].date)
            console.log(docs[0].date<docs[1].date)
            // docs.map(doc => console.log(doc.date))
            return res.json(docs);
        })
        .catch(err => console.log(`query error: ${err}`))
}

