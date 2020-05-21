const mongoose = require('mongoose')
const Leader = require('../models/opinion-leader')
const KeyWord = require('../models/KeyWord')

exports.initSystem = (req, res) => {
    let date = new Date();

    const leaders = req.body.leaders
    const keyWords = req.body.keyWords
    let leadersDocs  = []
    let keyWordsDocs  = []
    let allLines
    allLines = leaders.split(/\r\n|\n/);
    allLines.map(line => {
        if(line.trim().length)
            leadersDocs.push(
                {
                    full_name: line.trim(),
                    internal_create_date: date,
                    new_leader: true
                })
        })
    allLines = keyWords.split(/\r\n|\n/);
    allLines.map(line => {
        if(line.trim().length)
            keyWordsDocs.push({word: line.trim()})
        })
        
        Leader.insertMany(leadersDocs,  (err, docs) => {
            if (err){ 
                return res.status(500).send(err)
            } else {
                KeyWord.insertMany(keyWordsDocs,  (err, docs) => {
                    if (err){ 
                        return res.status(500).send(err)
                    } else {
                      res.json({success:true})
                    }
                  });
            }
          });
}