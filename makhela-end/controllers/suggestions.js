const mongoose = require('mongoose');
const Suggestions = require('../model/suggestions'); // access the MODEL
// for route /final-ideas/getAllIdeas
exports.getData = (req, res) => {
    Suggestions.find({})
        .then(docs => {return res.json(docs)})
        .catch(err => console.log(`query error: ${err}`))
};