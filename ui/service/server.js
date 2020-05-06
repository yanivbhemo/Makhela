const express   = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');

const opinionLeaderCtl   = require('./controllers/opinion-leader.ctl');
const suggestionsCtl   = require('./controllers/suggestion.ctl');
const postsCtl   = require('./controllers/Post.ctl');
const userCtl   = require('./controllers/User.ctl');
const {withAuth, withAuth2} = require('./middleware')

// const keywordsCtl   = require('./controllers/keywords.ctl');

const app       = express();
const port      = process.env.PORT || 3000;

app.set('port',port);

app.use('/', express.static('./public')); // for API
app.use(express.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.set('json spaces', 2);

app.use(   (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With, Content-Type, Accept");
    res.set("Content-Type", "application/json");
    next();
});

app.get('/opinion_leaders/getCommunitySize', withAuth, opinionLeaderCtl.getSize);
app.get('/opinion_leaders/getAllLeaders', withAuth, opinionLeaderCtl.getAllLeaders);
app.get('/opinion_leaders/getLocations', withAuth, opinionLeaderCtl.getLocations);
app.get('/opinion_leaders/getLocations/:location', withAuth, opinionLeaderCtl.getLeadersByLocation);
app.get('/opinion_leaders/moveToBlackList/:twitter_id', withAuth, opinionLeaderCtl.MoveToBlackList);
app.post('/opinion_leaders/addNewLeader', withAuth, opinionLeaderCtl.addNewLeader);
app.get('/suggestions/getSize', withAuth, suggestionsCtl.getSize);
app.get('/posts/getSize', withAuth, postsCtl.getSize);
app.post('/users/new', userCtl.createUser);
app.post('/users/auth2', userCtl.authenticate2);
app.get('/users/checkToken', withAuth, (req, res) => {res.sendStatus(200)})

app.listen(port, () => console.log(`listening on port ${port}`));