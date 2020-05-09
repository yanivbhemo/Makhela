import React, { Component } from "react";
import MoDSpecialist from './components/SuggestedLeader'
import { Button } from 'react-bootstrap'
import Header from './Header'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/App.css'
import MyNetwork from './components/Graph'


const MyRouter = () => {
    return (
      <div className="App" style={{ fontFamily: "Quicksand" }}>
      <Header/>
      {/* <Route path="/NetworkGraph" component={NetworkGraph}/> */}
      <Route path="/NetworkGraph" component={MyNetwork}/>
      <Route path="/MoDSpecialist" component={MoDSpecialist}/>
      {/* <Route path="/UpdateScore" component={UpdateScore}/> */}
     

  </div>
    );
  }


export default MyRouter;
