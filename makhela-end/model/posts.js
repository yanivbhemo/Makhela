var mongoose = require('mongoose'),
    posts     = new mongoose.Schema({
        _id: String,
        leader_twitter_id: Number,
        post_id: Number,
        full_text: String,
        date_created: Date,
        in_reply_to_status_id: Number,
        in_reply_to_status_text: String,
        in_reply_to_status_user_id: String,
        quoted_status_id: Number,
        quoted_status_text: String,
        quoted_status_user_id: Number,
        retweeted_status_id: Number,
        retweeted_status_text: String,
        retweeted_status_user_id: Number,
        checked_for_suggestions: Boolean
    });

    var Posts = mongoose.model('posts', posts);

    module.exports = Posts;