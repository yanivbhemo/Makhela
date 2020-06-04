const mongoose = require('mongoose')
const Reserch = require('../models/Research')

exports.saveSearch = (req, res) => {
    const data = req.body
    let rs = new Reserch(data);

    rs.save(function(err, doc) {
        if (err) return console.error(err);
        console.log("Document inserted succussfully!");
      });
}

exports.getSearchName = (req, res) => {
  Reserch.find({}) 
    .then(docs => {
      let names = []
      docs.map(doc => names.push(doc.searchName))
      res.json(names)
    })
    .catch(err => console.log(`query error: ${err}`))
}