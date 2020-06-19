import React from "react";
import Graph from "react-graph-vis";
import ReactTooltip from "react-tooltip";
import * as CONSTS from '../consts'
import Cookies from 'js-cookie';


class ResearchGraph extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        loading: true,
        leaders: [],
        nodes: [],
        edges: [],
        after: []
      };
      this.draw = this.draw.bind(this)
  }
   componentDidMount() {
    const url = CONSTS.GET_GRAPH_LEADERS
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({"token":Cookies.get('token')}),
      headers: {
        'Content-Type': 'application/json'
      }
  })
        .then(res => res.json())
        .then(data => { 
          let myNodes = []
          data.map(item => myNodes.push({id: item.id, 
                                        value: item.numPosts,  
                                        color: "#7c5295",
                                        label: item.twitterName, 
                                        title: `<div style="background-color:#e6e6e6;display:flex;flex-direction:column;align-items:center;">
                                                <h2 style="color:#6f38bc">${item.name}</h2>
                                                  <h4 style="color:#6f38bc">${item.twitterName}</h4>
                                                  <img style="height:200px" alt=${item.name} src="${item.twitterProfileImage}">
                                                <div/>`, 
                                        shape: "dot" }))
          let myEdges = []
          data.map(value => {
            if(Array.isArray(value.communityFollowing))
              value.communityFollowing.map(fl => myEdges.push({ from: value.id, to: fl}))
            })
          this.setState({nodes: myNodes, edges: myEdges, leaders:data, loading: false})              
        })
        .catch(err => console.error(err));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.startDate !== this.props.startDate) {
        let myNodes = []
        let afterLeaders = []
      this.state.leaders.map(item => {
        let temp = new Date(item.internalDate)
          if(temp>this.props.startDate){
            afterLeaders.push(item.id)
            myNodes.push({id: item.id, 
                value: item.numPosts, 
                color: "#C5000B",
                label: item.twitterName, 
                title: `<div style="background-color:#e6e6e6;display:flex;flex-direction:column;align-items:center;">
                        <h2 style="color:#6f38bc">${item.name}</h2>
                          <h4 style="color:#6f38bc">${item.twitterName}</h4>
                          <img style="height:200px" alt=${item.name} src="${item.twitterProfileImage}">
                        <div/>`, 
                shape: "dot" })
            }
        else myNodes.push({id: item.id, 
            value: item.numPosts, 
            color: "#7c5295",
            label: item.twitterName, 
            title: `<div style="background-color:#e6e6e6;display:flex;flex-direction:column;align-items:center;">
                    <h2 style="color:#6f38bc">${item.name}</h2>
                      <h4 style="color:#6f38bc">${item.twitterName}</h4>
                      <img style="height:200px" alt=${item.name} src="${item.twitterProfileImage}">
                    <div/>`, 
            shape: "dot" })
           
      })
      console.log(afterLeaders)
      this.setState({nodes: myNodes, after: afterLeaders})
      console.log(this.state.after)
  }
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
                console.log(nodes[0])
              }
              else{
                console.log("click")
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
          </React.Fragment>
        )
        
    }
   
  }
export default ResearchGraph
