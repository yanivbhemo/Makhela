import React from "react";
import Graph from "react-graph-vis";
import ReactTooltip from "react-tooltip";
import { degree, betweenness, closeness } from './ClosenessExp'
import * as CONSTS from '../consts'
import Cookies from 'js-cookie';


class Network extends React.Component {
  constructor() {
    super();
      this.state = {
        leaders: [],
        loading: true,
        posts: [],
        nodes: [],
        edges: [],
        leader: '',
        centrality: 'degCentrality',
        highlightActive: false,
      };
      this.draw = this.draw.bind(this)
      this.showLeader = this.showLeader.bind(this)
      this.centrality = this.centrality.bind(this)
      this.neighbourhoodHighlight = this.neighbourhoodHighlight.bind(this)
  }

  componentDidMount() {
    const url = CONSTS.GET_GRAPH_LEADERS

    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        "token":Cookies.get('token'),
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
        .then(res => res.json())
        .then(data => { 
          let myNodes = []
          data.map(item => myNodes.push({id: item.id, 
                                        value: item[this.state.centrality], 
                                        label: item.twitterName, 
                                        title: `<div style="background-color:#e6e6e6;display:flex;flex-direction:column;align-items:center;">
                                                <h2 style="color:#6f38bc">${item.name}</h2>
                                                  <h4 style="color:#6f38bc">${item.twitterName}</h4>
                                                  <img style="height:200px" alt=${item.name} src="${item.twitterProfileImage}">
                                                <div/>`, 
                                        group: item.community,
                                        shape: "dot" }))
          let myEdges = []
          data.map(value => {
            if(Array.isArray(value.communityFollowing))
              value.communityFollowing.map(fl => myEdges.push({ from: value.id, to: fl}))
            })
          this.setState({nodes: myNodes, edges: myEdges, loading: false, leaders: data})              
        })
        .catch(err => console.error(err));
  }

  centrality(centralityState){
    if(centralityState){
      let myNodes = []
      this.state.leaders.map(item => { 
        myNodes.push({id: item.id, 
                      value: item[centralityState], 
                      label: item.twitterName, 
                      group: item.community,
                      title: `<div style="background-color:#e6e6e6;display:flex;flex-direction:column;align-items:center;">
                              <h2 style="color:#6f38bc">${item.name}</h2>
                              <h4 style="color:#6f38bc">${item.twitterName}</h4>
                              <img style="height:200px" alt=${item.name} src="${item.twitterProfileImage}">
                            <div/>`, 
                    })
      })
      this.setState({centrality:centralityState, nodes: myNodes})
    }
  }

  neighbourhoodHighlight(selectedNode) {
    const found = this.state.leaders.find(element => element.id === selectedNode);
    if(found){
      // let following = found.communityFollowing
      const community = found.community
      let myNodes = []
    
    this.state.leaders.map(item =>{
      if(item.community === community ){
        myNodes.push({id: item.id, 
                      value: item[this.state.centrality] , 
                      label: item.twitterName, 
                      title:  `<div style="background-color:#e6e6e6;display:flex;flex-direction:column;align-items:center;">
                                <h2 style="color:#6f38bc">${item.name}</h2>
                                  <h4 style="color:#6f38bc">${item.twitterName}</h4>
                                  <img style="height:200px" alt=${item.name} src="${item.twitterProfileImage}">
                                <div/>`, 
                      group: item.community,
                      shape: "dot" })
      }
      else {
        myNodes.push({id: item.id, 
                      value: item[this.state.centrality], 
                      label: item.twitterName, 
                      title: `<div style="background-color:#e6e6e6;display:flex;flex-direction:column;align-items:center;">
                                <h2 style="color:#6f38bc">${item.name}</h2>
                                <h4 style="color:#6f38bc">${item.twitterName}</h4>
                                <img style="height:200px" alt=${item.name} src="${item.twitterProfileImage}">
                              <div/>`, 
                group: "gray",
                shape: "dot" })
      }
    
      })
        this.setState({nodes: myNodes, loading: false})    
    }
  }
  showLeader(leader){
    let found = this.state.leaders.find(element => element.id === leader);
    this.props.onChange(leader,found.twitterName, 
      found.followers, 
      found.following, 
      found.twitterProfileImage, 
      found.certainty, 
      found.description, 
      found.twitterCreatedAt,
      found.name,
      found.id
      )
  }

  draw(){
    const graph = {
      nodes: this.state.nodes,
      edges: this.state.edges
    };
    const options = {
      physics: {
        maxVelocity: 10,
        solver: "forceAtlas2Based",
        timestep: 0.005,
        stabilization: { iterations: 1 }
      },
      groups: {
        0: { color: "#FF9900" },// orange 
        1: { color: "#7c5295" },// purple
        2: { color: "#2B7CE9" },// blue
        3: { color: "#C5000B" },// red
        4: { color: "#FF9900" },// pink
        5: { color: "#006400" },// green
        6: { color: "#7D4219" },// brown
        gray: { color: "#e6e6e6" },
      },
      layout: {
        randomSeed: 34,
        hierarchical: false
      },  
      nodes: {
        scaling: {
          customScalingFunction: (min, max, total, value) => {return value / total},
            min: 5,
            max: 150
        },
        font: { size: 12, face: "Tahoma" }
      },
      edges: {
        smooth: {
          type: "continuous",
          forceDirection: "none",
          roundness: 0.5
        },
        color: { inherit: "from" },
      },
      height: "400px", 
      }
   
    const events = {
      select: (event) => {
              let { nodes, edges } = event;
              if(nodes[0]){
                this.showLeader(nodes[0])
                this.neighbourhoodHighlight(nodes[0])
              }
              else{
                let myNodes = []
                this.state.leaders.map(item => 
                  myNodes.push({id: item.id, 
                    value: item[this.state.centrality], 
                    label: item.twitterName, 
                    title: `<div style="background-color:#e6e6e6;display:flex;flex-direction:column;align-items:center;">
                              <h2 style="color:#6f38bc">${item.name}</h2>
                              <h4 style="color:#6f38bc">${item.twitterName}</h4>
                              <img style="height:200px" alt=${item.name} src="${item.twitterProfileImage}">
                            <div/>`, 
                    group: item.community,
                    shape: "dot" })
                )
                  this.setState({nodes:myNodes})
              }
              
            }
    }
    return <Graph graph={graph} options={options} events={events}/>
  }  
  

  render() {
      if(this.state.loading)
        return <h1>Graph loading</h1>
      else
        return(
          <React.Fragment>
            {this.draw()}

            <button  data-for="degCentrality" style={{marginRight: "10px", marginTop:"10px"}} className="btn btn-theme03" data-tip onClick={() => this.centrality('degCentrality')}>Degree Centrality</button>
            <ReactTooltip type="warning" id="degCentrality" getContent={() => degree}/>
           
            <button  data-for="betweennessCentrality" style={{marginRight: "10px", marginTop:"10px"}} className="btn btn-theme03" data-tip  onClick={() => this.centrality('betweennessCentrality')}>Betweenness Centrality</button>
            <ReactTooltip type="warning" id="betweennessCentrality" getContent={() => betweenness}/>

            <button data-for="closenessCentrality" style={{marginRight: "10px", marginTop:"10px"}} className="btn btn-theme03" data-tip onClick={() => this.centrality('closenessCentrality')}>Closeness Centrality</button>
            <ReactTooltip type="warning" id="closenessCentrality" getContent={() => closeness}/>
            
          </React.Fragment>
        )
        
        
    }
   
  }
export default Network
