const mongoose = require('mongoose');
const Leader = require('../models/opinion-leader')
const Post = require('../models/Post')

exports.getLeaders = (req, res) => {
    Leader.find({})
        .then(docs => {
            let data = []
            docs.map(item => { 
                data.push(
                    {
                        id: item.twitter_id,
                        name: item.full_name,
                        twitterCreatedAt : item.twitter_created_at,
                        description: item.twitter_description,
                        followers: item.twitter_followers_count,
                        following: item.twitter_friends_count,
                        twitterName: item.twitter_screen_name,
                        communityFollowing: item.community_following,
                        location: item.twitter_location,
                        numPosts: item.twitter_statuses_count,
                        certainty: item.level_of_certainty,
                        twitterProfileImage: item.twitter_profile_image,
                        analyzedDate: item.analyzed_date,
                        community: item.community, 
                        degCentrality: item.deg_centrality,
                        betweennessCentrality: item.betweenness_centrality,
                        closenessCentrality: item.closeness_centrality,
                        community_following: item.community_following,
                        internalDate: item.internal_create_date
                      },
                )
              })
              data.map(item =>{
                  if(item.communityFollowing)
                    item.communityFollowing = item.communityFollowing.map(value =>  value[0].twitter_id.toString())
              })
              console.log(docs[0])
              console.log(data[0])
            return res.json(data)
        })
        .catch(err => console.log(`query error: ${err}`))
};

exports.getPosts = (req, res) => {
    let { leader } = req.body;
    Post.find({ "leader_twitter_id": leader })
    .then(docs => {
        let data = []
        docs.map(item => { 
            data.push(
                {
                    id: item.leader_twitter_id,
                    postId: item.post_id,
                    fulText: item.full_text,
                    dateCreated: item.date_created,
                    replyPostId: item.in_reply_to_status_id,
                    retweetCount: item.retweet_count,
                    likes: item.likes,
                    keyWords: item.key_word,
                },
            )
          })
          
          console.log(docs)
        return res.json(data)
    })
        .catch(err => console.log(`query error: ${err}`))
};