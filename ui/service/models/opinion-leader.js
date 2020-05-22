var mongoose = require('mongoose')

var leader = new mongoose.Schema({
    full_name: {type: String, required: true, index: 2 },
    new_leader: Boolean,
    twitter_created_at: Date,
    twitter_description: String,
    twitter_followers_count: Number,
    twitter_friends_count: Number,
    twitter_id: {type: String, index: 1},
    twitter_location: String,
    twitter_screen_name: String,
    twitter_statuses_count: Number,
    level_of_certainty: {type: Number},
    community_following: [[]],
    lock: Boolean,
    twitter_profile_image: String,
    internal_create_date: {type: Date},
    community: Number,
    deg_centrality: Number,
    betweenness_centrality: Number,
    closeness_centrality: Number,
    analyzed_date: Date,
    native_id: Number
}, { collection: 'opinion_leaders', versionKey: ''} )

var Leader = mongoose.model('Leader', leader)

module.exports = Leader;