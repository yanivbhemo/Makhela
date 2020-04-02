import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import App from "./components/App";
import "./typography.css";
// import "./index.css"
import MyRouter from "./router";
import { Router } from 'react-router';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <MyRouter />
    </BrowserRouter>, 
    document.getElementById('root')
)

// ReactDOM.render(<MyRouter />, document.getElementById("root"));
registerServiceWorker();
