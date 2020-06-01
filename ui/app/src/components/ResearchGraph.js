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
        nodesPosts: [],
        edgesPosts: [],
        after: []
      };
      this.draw = this.draw.bind(this)
      this.drawPosts = this.drawPosts.bind(this)
      this.fetchPosts = this.fetchPosts.bind(this)
  }

  fetchPosts(){
    let leaders = this.state.after
    console.log(leaders)
    const url = CONSTS.GET_GRAPH_POSTS
    let mynodes = [] 
    let myEdges = []
    leaders.map(item => {
        let formBody = "leader="+item

        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            body: formBody
          })
          .then(res => res.json())
              .then(data => {                 
      
                mynodes.push({id: item,size: 100})
                data.map(item => { 
                  mynodes.push({
                                id: item.postId.toString(), 
                                // color: "#86A3C3",
                                shape: "dot",
                                title: `<div style="background-color:#e6e6e6;display:flex;flex-direction:column;align-items:center;">
                                        <p style="color:#6f38bc">${item.fulText}</p>
                                        <p style="color:#6f38bc">${item.dateCreated.toString()}</p>
                                      <div/>` ,
                                value: item.likes,
                                group: item.keyWords
                                
                              })
                  myEdges.push({ from: item, to: item.postId.toString(), value:item.retweetCount})
                })
      
                      
            })
              .catch(err => console.error(err));

    })
    this.setState({nodesPosts: mynodes, edgesPosts: myEdges, loading: false})
  }


   componentDidMount() {
    const url = CONSTS.GET_GRAPH_LEADERS
    fetch(url, {
      method: 'POST',
      // body: JSON.stringify({"token":Cookies.get('token')}),
      body: JSON.stringify({"token":Cookies.get('token')}),
      headers: {
        'Content-Type': 'application/json'
      }
  })
    fetch(url)
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
      this.fetchPosts()
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
    console.log(graph)
    return <Graph graph={graph} options={options} events={events}/>
  }  

  drawPosts(){
    const graph = {
      nodes: this.state.nodesPosts,
      edges: this.state.edgesPosts
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
        color: { inherit: "to" },
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
    console.log(graph)
    return <Graph graph={graph} options={options} events={events}/>
  }  
  

  render() {
      if(this.state.loading)
        return <h1>Graph loading</h1>
      else
        return(
          <React.Fragment>
                {this.draw()}  
                {this.drawPosts()}  
          </React.Fragment>
        )
        
    }
   
  }
export default ResearchGraph
