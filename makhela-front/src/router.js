import React, { Component } from "react";
import NetworkGraph from './components/NetworkGraph'
import MoDSpecialist from './components/SuggestedLeader'
// import SuggestedLeader from './Leader'
import { Button } from 'react-bootstrap'
import Header from './Header'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/App.css'
// import './App.css'

const MyRouter = () => {
    return (
      <div className="App" style={{ fontFamily: "Quicksand" }}>
      <Header/>
      <Route path="/NetworkGraph" component={NetworkGraph}/>
      <Route path="/MoDSpecialist" component={MoDSpecialist}/>
      {/* <Route path="/UpdateScore" component={UpdateScore}/> */}
     

  </div>
    );
  }


export default MyRouter;
