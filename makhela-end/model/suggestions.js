var mongoose = require('mongoose'),
    suggestions     = new mongoose.Schema({
        _id: String,
        twitter_id: String,
        full_name: String,
        twitter_screen_name: String,
        twitter_location: String,
        twitter_description: String,
        twitter_followers_count: Number,
        twitter_friends_count: Number,
        twitter_created_at: Date,
        twitter_statuses_count: Number,
        new_leader: Boolean,
        level_of_certainty: Number,
        twitter_profile_image: String,
        lock: Boolean
    });

    var Suggestions = mongoose.model('suggestions', suggestions);

    module.exports = Suggestions;