import React, { Component } from "react";
import NetworkGraph from './NetworkGraph'
import MoDSpecialist from './SuggestedLeader'
// import SuggestedLeader from './Leader'
import { Button } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'

class App extends Component {
  constructor() {
    super();
      this.state = {
        view: "NetworkGraph"
      };
    this.handleClick = this.handleClick.bind(this);
    this.show = this.show.bind(this);
  }
  handleClick(str) {
    this.setState({view: str})
    // // e.preventDefault();
    // console.log(this.state.leaders[i]);
    console.log(str);
  }
  show(){
    console.log(this.state.view)
    let myComponent = this.state.view
    if(myComponent==="SuggestedLeader")
      return <MoDSpecialist/>
    else if(myComponent==="NetworkGraph")
      return <NetworkGraph/>
    else
      return
  }
  render() {
    return (
      <div className="App" style={{ fontFamily: "Quicksand" }}>
        <Button onClick={() => this.handleClick("SuggestedLeader")}>Suggested Leader</Button>
        <Button onClick={() => this.handleClick("NetworkGraph")}>Network Graph</Button>
        {this.show()}
        {/* <MoDSpecialist/> */}
        {/* <NetworkGraph/> */}
      </div>
    );
  }
}

export default App;
