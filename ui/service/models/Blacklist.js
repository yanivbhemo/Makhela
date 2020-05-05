var mongoose = require('mongoose')

var blacklist_leader = new mongoose.Schema({
    full_name: {type: String, required: true, index: 2 },
    new_leader: Boolean,
    twitter_created_at: Date,
    twitter_description: String,
    twitter_followers_count: Number,
    twitter_friends_count: Number,
    twitter_id: {type: Number, required: true, index: 1},
    twitter_location: String,
    twitter_screen_name: String,
    twitter_statuses_count: Number,
    level_of_certainty: {type: Number, required: true},
    community_following: Number,
    lock: Boolean,
    twitter_profile_image: String,
    internal_create_date: {type: Date, required: true},
    community: Number,
    deg_centrality: Number,
    betweenness_centrality: Number,
    closeness_centrality: Number,
    analyzed_date: Date
}, { collection: 'blacklist', versionKey: ''} )

var BlackListLeader = mongoose.model('BlackListLeader', blacklist_leader)

module.exports = BlackListLeader