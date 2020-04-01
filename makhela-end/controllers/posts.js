const mongoose = require('mongoose');
const Posts = require('../model/posts'); // access the MODEL
// for route /final-ideas/getAllIdeas
exports.getData = (req, res) => {
    var { leader } = req.body;
    // console.log(leader)
    // leader = parseInt(leader)
    Posts.find({ "leader_twitter_id": leader })
        
        // const result = await Group.find({Points:{$gte:points},W:{$gte:wins}});
        // if (result) {
        //     console.log(result);
        //     res.json(result);
        // }
        .then(docs => {
            console.log(docs)
            return res.json(docs)
        })
        // .then(docs => {return res.json(docs)})
        .catch(err => console.log(`query error: ${err}`))
};