var mongoose = require('mongoose'),
    leaders     = new mongoose.Schema({
        _id: String,
        full_name: String,
        new_leader: Boolean,
        twitter_created_at: Date,
        twitter_description: String,
        twitter_followers_count: Number,
        twitter_friends_count: Number,
        twitter_id: String,
        twitter_location: String,
        twitter_screen_name: String,
        twitter_statuses_count: Number,
        level_of_certainty: Number,
        community_following: Object,
        lock: Boolean,
        twitter_profile_image: String,
        posts: Object
    });
   
    var Leaders = mongoose.model('opinion_leaders', leaders);

    module.exports = Leaders;