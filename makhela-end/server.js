const express = require('express');
const suggestions = require('./controllers/suggestions')
const app  = express(),
      port = process.env.PORT || 3000;

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(
    (req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.set("Content-Type", "application/json");
        next();
    });


app.all('*', suggestions.getData);


app.listen(port,
    () => console.log('Express server ready for requests on: ', port));