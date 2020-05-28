import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router} from 'react-router-dom';
import ReactRouter from './router/router'


ReactDOM.render(
    <Router>
        <ReactRouter />
    </Router>, document.getElementById('root')
)

serviceWorker.unregister();