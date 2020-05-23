const consts = require('./consts');
const { SSL_KEY_PATH, SSL_CERT_PATH } = consts;
const https = require('https');
const fs = require('fs');

const express   = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const cors = require('cors')

const initCtl   = require('./controllers/Initiation.ctl');
const opinionLeaderCtl   = require('./controllers/opinion-leader.ctl');
const suggestionsCtl   = require('./controllers/suggestion.ctl');
const blackListCtl = require('./controllers/Blacklist.ctl');
const postsCtl   = require('./controllers/Post.ctl');
const userCtl   = require('./controllers/User.ctl');
const systemCtl = require('./controllers/system.ctl')
const {withAuth,withAuthToken} = require('./middleware')

const app       = express();
const port      = process.env.PORT || 3002;

app.set('port',port);
app.use(cors())
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

app.post('/initiation', withAuth, initCtl.initSystem);

app.post('/opinion_leaders/getCommunitySize', withAuth, opinionLeaderCtl.getSize);
app.post('/opinion_leaders/getAllLeaders', withAuth, opinionLeaderCtl.getAllLeaders);
app.post('/opinion_leaders/getLeadersByRange', withAuth, opinionLeaderCtl.getLeadersByRange);
app.post('/opinion_leaders/getAllLeadersLimited', withAuth, opinionLeaderCtl.getAllLeadersLimited);
app.post('/opinion_leaders/getLocations', withAuth, opinionLeaderCtl.getLocations);
app.post('/opinion_leaders/getLocations/:location', withAuth, opinionLeaderCtl.getLeadersByLocation);
app.post('/opinion_leaders/moveToBlackList/:twitter_screen_name', withAuth, opinionLeaderCtl.MoveToBlackList);
app.post('/opinion_leaders/addNewLeader', withAuth, opinionLeaderCtl.addNewLeader);
app.post('/opinion_leaders/leader/:twitter_screen_name', withAuth, opinionLeaderCtl.getLeader)
app.post('/opinion_leaders/leader/getLeaderFriends/:twitter_screen_name', withAuth, opinionLeaderCtl.getLeaderFriends)
app.post('/opinion_leaders/getLeaderShortDetails/:twitter_screen_name', withAuth, opinionLeaderCtl.getLeaderShortDetails)

app.post('/suggestions/getSize', withAuth, suggestionsCtl.getSize);
app.post('/suggestions/getAllSuggestions', withAuth, suggestionsCtl.getAllSuggestions);
app.post('/suggestions/getSuggestionsByRange', withAuth, suggestionsCtl.getSuggestionsByRange);
app.post('/suggestions/getAllSuggestionsLimited', withAuth, suggestionsCtl.getAllSuggestionsLimited);
app.post('/suggestions/getLocations', withAuth, suggestionsCtl.getLocations);
app.post('/suggestions/getLocations/:location', withAuth, suggestionsCtl.getSuggestionsByLocation);
app.post('/suggestions/moveToBlackList/:twitter_screen_name', withAuth, suggestionsCtl.MoveToBlackList);
app.post('/suggestions/suggestion/:twitter_screen_name', withAuth, suggestionsCtl.getSuggestion)
app.post('/suggestions/suggestion/getSuggestionFriends/:twitter_id', withAuth, suggestionsCtl.getSuggestionFriends)
app.post('/suggestions/getSuggestionShortDetails/:twitter_id', withAuth, suggestionsCtl.getSuggestionShortDetails)
app.post('/suggestions/moveToCommunity', withAuth, suggestionsCtl.moveToCommunity)

app.post('/blacklist/getSize', withAuth, blackListCtl.getSize);
app.post('/blacklist/getAllBlackListLeaders', withAuth, blackListCtl.getAllBlackListLeaders);
app.post('/blacklist/getBlackListLeadersByRange', withAuth, blackListCtl.getBlackListLeadersByRange);
app.post('/blacklist/getAllBlackListLeadersLimited', withAuth, blackListCtl.getAllBlackListLeadersLimited);
app.post('/blacklist/getLocations', withAuth, blackListCtl.getLocations);
app.post('/blacklist/getLocations/:location', withAuth, blackListCtl.getBlackListLeadersByLocation);
app.post('/blacklist/:twitter_screen_name', withAuth, blackListCtl.getBlackListLeader)
app.post('/blacklist/getBlackListLeaderFriends/:twitter_id', withAuth, blackListCtl.getBlackListLeaderFriends)
app.post('/blacklist/getBlackListLeaderShortDetails/:twitter_id', withAuth, blackListCtl.getBlackListLeaderShortDetails)
app.post('/blacklist/moveToCommunity/:twitter_screen_name', withAuth, blackListCtl.moveToCommunity)

app.post('/posts/getSize', withAuth, postsCtl.getSize);
app.post('/posts/getLeaderPosts/:twitter_id', withAuth, postsCtl.getLeaderPosts);
app.post('/users/new', userCtl.createUser);
app.post('/users/auth2', userCtl.authenticate2);
app.post('/users/checkToken', withAuth, (req, res) => {res.sendStatus(200)})
app.get('/users/checkToken/:token', withAuthToken, (req, res) => {res.sendStatus(200)})

app.post('/system/init', withAuth, systemCtl.initSystem)
app.post('/system/init_status', withAuth, systemCtl.checkSystemStatus)

if(process.env.node_environment === "production")
{
    const options = {
        key: fs.readFileSync(SSL_KEY_PATH),
        cert: fs.readFileSync(SSL_CERT_PATH)
    };
    var httpsServer = https.createServer(options, app);
    httpsServer.listen(port, () => console.log(` - Production version! -\nlistening on port ${port}`))
}
else app.listen(port, () => console.log(` - Development version - \nlistening on port ${port}`));