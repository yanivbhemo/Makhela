import React from "react";
import ReactDOM from "react-dom";
import registerServiceWorker from "./registerServiceWorker";
import App from "./components/App";
import "./typography.css";
// import "./index.css"
import ReactRouter from './router'
import { Router } from 'react-router';


// ReactDOM.render(
//     <Router>
//         <ReactRouter/>
//     </Router>, document.getElementById('root'));


ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
