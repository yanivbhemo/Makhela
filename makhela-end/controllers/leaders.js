const mongoose = require('mongoose');
const Leaders = require('../model/leaders'); // access the MODEL

exports.getLeaders = (req, res) => {
    Leaders.find({})
        .then(docs => {
            let data = []
            docs.map(item => { 
                data.push(
                    {
                        id: item.twitter_id,
                        name: item.full_name,
                        followers: item.twitter_followers_count,
                        following: item.twitter_friends_count,
                        twitterName: item.twitter_screen_name,
                        communityFollowing: item.community_following,
                        community: item.community,
                        degCentrality:item.community,
                        betweennessCentrality:item.community,
                        closenessCentrality: item.community,
                        analyzedDate: item.community,
                      },
                )
              })
              data.map(item =>{
                  if(item.communityFollowing){
                    item.communityFollowing = item.communityFollowing.map(value => {return value.twitter_id.toString()})
                  }
              })
           
            console.log(docs.length)
            console.log(docs[0])
            return res.json(data)
        })
        // .then(docs => {return res.json(docs)})
        .catch(err => console.log(`query error: ${err}`))
};
