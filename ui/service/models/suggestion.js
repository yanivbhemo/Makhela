var mongoose = require('mongoose')

var suggestion = new mongoose.Schema({
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
    lock: Boolean,
    twitter_profile_image: String,
    internal_create_date: {type: Date, required: true},   
}, { collection: 'suggestions', versionKey: ''} )

var Suggestion = mongoose.model('Suggestion', suggestion)

module.exports = Suggestion;