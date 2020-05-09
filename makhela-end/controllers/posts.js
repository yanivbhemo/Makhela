const mongoose = require('mongoose');
const Posts = require('../model/posts'); // access the MODEL
// for route /final-ideas/getAllIdeas
exports.getData = (req, res) => {
    var { leader } = req.body;
    Posts.find({ "leader_twitter_id": leader })
    .then(docs => {
        let data = []
        docs.map(item => { 
            data.push(
                {
                    id: item.leader_twitter_id,
                    postId: item.post_id,
                    fulText: item.full_text,
                    dateCreated: item.date_created,
                    replyPostId: item.in_reply_to_status_id
                  },
            )
          })
        return res.json(data)
    })
        .catch(err => console.log(`query error: ${err}`))
};

exports.getPosts= (req, res) => {
    // var query = Posts.find({}).stream();
    // query.on('data',  doc => {
    //     console.log("stream")
    // }).on('error', err => {
    //     console.log(err)
    // }).on('close', () => {
    //     return res.json(query[0])
    // });
};

exports.getPost= (req, res) => {
    // var { post } = req.body;
    // Posts.find({ "post_id": post  })
    // .then(docs => {
    //     // let data = []
    //     // docs.map(item => { 
    //     //     data.push(
    //     //         {
    //     //             id: item.leader_twitter_id,
    //     //             postId: item.post_id,
    //     //             fulText: item.full_text,
    //     //             dateCreated: item.date_created,
    //     //             replyPostId: item.in_reply_to_status_id
    //     //           },
    //     //     )
    //     //   })
    //     // return res.json(data)
    //     return res.json(docs)
    // })
    //     .catch(err => console.log(`query error: ${err}`))
};