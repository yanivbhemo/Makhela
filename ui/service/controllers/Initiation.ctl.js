const mongoose = require('mongoose')
const Leader = require('../models/opinion-leader')

exports.initSystem = (req, res) => {
    let d = new Date();

    const leaders = req.body.leaders
    const keyWords = req.body.keyWords
    let leadersDocs  = []
    
    let allLines = leaders.split(/\r\n|\n/);
       
    // allLines.forEach(line => {
    //     if (line.trim().isEmpty() == false){
    //         leadersDocs.push(
    //             {
    //                 full_name: line,
    //                 internal_create_date: d,
    //                 new_leader: true
    //             })
    //     }
    // })

    // Leader.insertMany(leadersDocs)
    //       .then(docs => {
    //         console.log(keyWords)
    //         console.log(leaders)  
    //         res.json(docs)})
    //       .catch(err => res.status(500).send(err))
   



    res.json({success:true})
}