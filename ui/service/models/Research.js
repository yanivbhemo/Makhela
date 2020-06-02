var mongoose = require('mongoose')

var research = new mongoose.Schema({
    startDate: Date,
    before: Date,
    after: Date,
    question: String,
    searchWords : Object,
    posts: Object,
    disabled: Boolean,
    leader: Object,
    leaderData: Object,
    searchName: String
    }, { collection: 'research'} )

var Research = mongoose.model('Research', research);

module.exports = Research;