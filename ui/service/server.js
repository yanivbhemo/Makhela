const express   = require('express');
const opinionLeaderCtl   = require('./controllers/opinion-leader.ctl');
const suggestionsCtl   = require('./controllers/suggestions.ctl');
// const postsCtl   = require('./controllers/posts.ctl');
// const keywordsCtl   = require('./controllers/keywords.ctl');
const app       = express();
const port      = process.env.PORT || 3000;

app.set('port',port);

app.use('/', express.static('./public')); // for API

app.use(   (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept");
    res.set("Content-Type", "application/json");
    next();
});

app.get('/opinion_leaders/getCommunitySize', opinionLeaderCtl.getSize);

app.listen(port, () => console.log(`listening on port ${port}`));