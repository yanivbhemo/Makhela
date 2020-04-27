var mongoose = require('mongoose')

var post = new mongoose.Schema({
    leader_twitter_id:Number,
    post_id:Number,
    full_text:String,
    date_created:Date,
    in_reply_to_status_id:Number,
    in_reply_to_status_text:String,
    in_reply_to_status_user_id:String,
    quoted_status_id:Number,
    quoted_status_text:String,
    quoted_status_user_id:String,
    retweeted_status_id:Number,
    retweeted_status_text:String,
    retweeted_status_user_id:String,
    checked_for_suggestions:Boolean,
    internal_create_date:Date
}, { collection: 'posts' }, {versionKey: ''} )

var Post = mongoose.model('Post', post);

module.exports = Post;