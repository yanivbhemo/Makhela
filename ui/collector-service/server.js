const consts = require('./consts');
const { SSL_KEY_PATH, SSL_CERT_PATH } = consts;
const https = require('https');
const fs = require('fs');
const express   = require('express');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const helmet = require('helmet')
const cors = require('cors')
const {withAuth,withAuthToken} = require('./middleware')
const { exec } = require("child_process");
var spawn = require("child_process").spawn;

const app       = express();
const port      = process.env.PORT || 3005;

app.set('port',port);
app.use(cors())
app.use(helmet())
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

app.post('/connections/run', withAuth, (req, res) => {
    command = "/usr/bin/docker run -it --rm --name connections-collection -e consumer_key=" + process.env.consumer_key + " -e consumer_secret=" + process.env.consumer_secret + " -e access_token=" + process.env.access_token + " -e access_token_secret=" + process.env.access_token_secret + " -e db_username=" + process.env.db_username + " -e db_password=" + process.env.db_password + " -e slack_url=" + process.env.slack_url + " -e RUN_TYPE=connections -e COLLECTION=opinion_leaders makhela/collector_2.0.32 > /root/logs/connections-collection"
    try{
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                res.sendStatus(503)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                res.sendStatus(503)
            }
            console.log(`${stdout}`);        
        });
    } catch(error) {
        console.log(error)
    }
    res.sendStatus(200)
})

app.post('/connections/status', withAuth, (req, res) => {
    console.log("connections status")
    command = "docker container inspect connections-collection"
    try{
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                res.sendStatus(503)
            }
            else if (stderr) {
                console.log(`stderr: ${stderr}`);
                res.sendStatus(503)
            }
            else {
                console.log(`${stdout}`);
                res.sendStatus(200)
            }
        });
    } catch(error) {
        console.log(error)
        res.sendStatus(503)
    }
})

app.post('/suggestions/run', withAuth, (req, res) => {
    console.log("suggestions run")
    command = "/usr/bin/docker run -it --rm --name suggestions-collection -e consumer_key=" + process.env.consumer_key + " -e consumer_secret=" + process.env.consumer_secret + " -e access_token=" + process.env.access_token + " -e access_token_secret=" + process.env.access_token_secret + " -e db_username=" + process.env.db_username + " -e db_password=" + process.env.db_password + " -e slack_url=" + process.env.slack_url + " makhela/suggestions_2.0.32 > /root/logs/suggestions-collection"
    try{
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                res.sendStatus(503)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                res.sendStatus(503)
            }
            console.log(`${stdout}`);        
        });
    } catch(error) {
        console.log(error)
    }
    res.sendStatus(200)
})

app.post('/suggestions/health', withAuth, (req, res) => {
    console.log("suggestions health")
    res.sendStatus(200)
})

app.post('/suggestions/status', withAuth, (req, res) => {
    console.log("suggestions status")
    res.sendStatus(200)
})

app.post('/tweets/run', withAuth, (req, res) => {
    console.log("tweets run")
    command = "/usr/bin/docker run -it --rm --name tweets-collection -e consumer_key=" + process.env.consumer_key + " -e consumer_secret=" + process.env.consumer_secret + " -e access_token=" + process.env.access_token + " -e access_token_secret=" + process.env.access_token_secret + " -e db_username=" + process.env.db_username + " -e db_password=" + process.env.db_password + " -e slack_url=" + process.env.slack_url + " -e RUN_TYPE=tweets -e COLLECTION=opinion_leaders makhela/collector_2.0.32 > /root/logs/tweets-collection"
    try{
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                res.sendStatus(503)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                res.sendStatus(503)
            }
            console.log(`${stdout}`);        
        });
    } catch(error) {
        console.log(error)
    }
    res.sendStatus(200)
})

app.post('/tweets/health', withAuth, (req, res) => {
    console.log("tweets health")
    res.sendStatus(200)
})

app.post('/tweets/status', withAuth, (req, res) => {
    console.log("tweets status")
    res.sendStatus(200)
})

app.post('/analyzer/run', withAuth, (req, res) => {
    console.log("analyzer run")
    command = "/usr/bin/docker run -it --rm --name analyzer -e environment=production -e db_password="+process.env.db_password+" -e db_username="+process.env.db_username+" makhela/analyzer_1.0 > /root/logs/analyzer"
    try{
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                res.sendStatus(503)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                res.sendStatus(503)
            }
            console.log(`${stdout}`);        
        });
    } catch(error) {
        console.log(error)
    }
    res.sendStatus(200)
})

app.post('/analyzer/health', withAuth, (req, res) => {
    console.log("analyzer health")
    res.sendStatus(200)
})

app.post('/analyzer/status', withAuth, (req, res) => {
    console.log("analyzer status")
    res.sendStatus(200)
})

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