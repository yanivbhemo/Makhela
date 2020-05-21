const mongoose = require('mongoose')
const Leader = require('../models/opinion-leader')
const Keyword = require('../models/Keyword')
const Setting = require('../models/Setting')

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
                    full_name: (line.trim()).replace(/  +/g, ' '),
                    internal_create_date: date,
                    new_leader: true,
                    lock: false
                })
        })
    allLines = keyWords.split(/\r\n|\n/);
    allLines.map(line => {
        if(line.trim().length)
            keyWordsDocs.push({word: line.trim(), internal_create_date: date})
        })
        Leader.insertMany(leadersDocs,  (err, docs) => {
            if (err){ 
                return res.status(500).send(err)
            } else {
                Keyword.insertMany(keyWordsDocs,  (err, docs) => {
                    if (err){ 
                        console.log(err)
                        return res.status(500).send(err)
                    } else {
                      Setting.updateOne({attribute: "NEW_SYSTEM"}, {$set: {value: false}})
                      .then(()=>{
                        return res.json({success:true})
                      })
                    }
                  });
            }
          });
}