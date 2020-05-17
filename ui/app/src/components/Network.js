import React from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import ReactTooltip from "react-tooltip";
import { degree, betweenness, closeness } from './ClosenessExp'
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
        centrality: 'degCentrality'
      };
      this.draw = this.draw.bind(this)
      this.showLeader = this.showLeader.bind(this)
      this.fetchPosts = this.fetchPosts.bind(this)
      this.centrality = this.centrality.bind(this)
  }

  centrality(centralityState){
    console.log(centralityState)
    this.setState({centrality:centralityState})
    switch(this.state.centrality){
            case 'degCentrality':
             var  mynodes =  this.state.leaders.map(item => { 
                return {id: item.id, 
                        value: item.degCentrality, 
                        label: item.twitterName, 
                        group: item.community,
                        title: `<div style="padding:10px;background-color:black">
                                  <h2 style="color:blue">${item.name}</h2>
                                  <h4 style="color:green">${item.twitterName}</h4>
                                  <img style="height:200px" alt=${item.name} src="${item.twitterProfileImage}">
                                <div/>`
                      }
              })
              break;
            case 'betweennessCentrality':
              var mynodes =  this.state.leaders.map(item => { 
                return {id: item.id, value: item.betweennessCentrality , label: item.twitterName, title: item.name, group: item.community }
              })
              break;
            case 'closenessCentrality':
              var mynodes =  this.state.leaders.map(item => { 
                return {id: item.id, value: item.degCentrality , label: item.twitterName, title: item.name, group: item.community }
              })
              break;
          }
          this.setState({nodes:mynodes})
  }

  fetchPosts(){
    // event.preventDefault()
    this.setState({loading: true})
    let formBody = "leader="+this.state.leader
    console.log(this.state.leader)
    let found = this.state.leaders.find(element => element.id == this.state.leader);
    console.log(found)
    const url = 'https://makhela-graph.herokuapp.com/allposts'

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: formBody
    })
    .then(res => res.json())
        .then(data => { 
          this.setState({ posts: data })
          var mynodes = [] 
          var myEdges = []

          mynodes.push({id: this.state.leader, shape:"circularImage", image: found.twitterProfileImage, size: 100})
          this.state.posts.map(item => { 
            mynodes.push({
                          id: item.postId.toString(), 
                          color: "#86A3C3",
                          shape: "dot",
                          title: `<div style="padding:10px;background-color:black">
                                  <p style="color:blue">${item.fulText}</p>
                                  <p style="color:green">${item.dateCreated.toString()}</p>
                                <div/>` 
                          
                        })
            myEdges.push({ from: this.state.leader, to: item.postId.toString(), color: "#86A3C3"})
          })

          this.setState({nodes: mynodes, edges: myEdges, loading: false})       
      })
        .catch(err => console.error(err));
    }

  showLeader(id){
    let leader = this.state.leaders.find(element => element.id === id);
    return(
      <React.Fragment>
        <h1>name: {leader.name}</h1>
        <h1>twitter name: {leader.twitterName}</h1>
        <h1>followers: {leader.followers}</h1>
        <h1>following: {leader.following}</h1>   
        <button onClick={() => this.fetchPosts()}>Show posts graph</button>
    </React.Fragment>
    )
    // console.log(leader);

  }
  draw(){
    const graph = {
      nodes: this.state.nodes,
      edges: this.state.edges
    };
    const options = {
      physics: {
        maxVelocity: 146,
        solver: "forceAtlas2Based",
        timestep: 0.35,
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
              var { nodes, edges } = event;
              if(nodes[0])
                this.setState({leader : nodes[0]})
            }
    };
    return <Graph
                graph={graph}
                options={options}
                events={events}
                getNetwork={network => {
                  //  if you want access to vis.js network api you can set the state in a parent component using this property
                }}
              />
  }  
  componentDidMount() {
    const url = 'https://makhela-graph.herokuapp.com/getLeaders';
    fetch(url)
        .then(res => res.json())
        .then(data => { 
          this.setState({ leaders: data })
          let mynodes =  this.state.leaders.map(item => { 
            return {id: item.id, value: item.closenessCentrality , label: item.twitterName, title: item.name, group: item.community, shape: "dot" }
          })
          let myEdges = []
          this.state.leaders.map(value => {
              if(Array.isArray(value.communityFollowing)){
                  value.communityFollowing.map(fl => {
                      myEdges.push({ from: value.id, to: fl})
                  })
              }
              });
          this.setState({nodes: mynodes, edges: myEdges, loading: false})              
      })
        .catch(err => console.error(err));
  }

  render() {
      if(this.state.loading)
        return <h1>Graph loading</h1>
      else
        return(
          <div>
            <button  data-for="degCentrality" data-tip onClick={() => this.centrality('degCentrality')}>Degree Centralitys</button>
            <ReactTooltip type="warning" id="degCentrality" getContent={() => degree}/>
           
            <button  data-for="betweennessCentrality" data-tip  onClick={() => this.centrality('betweennessCentrality')}>Betweenness Centrality</button>
            <ReactTooltip type="warning" id="betweennessCentrality" getContent={() => betweenness}/>

            <button data-for="closenessCentrality" data-tip onClick={() => this.centrality('closenessCentrality')}>Closeness Centrality</button>
            <ReactTooltip type="warning" id="closenessCentrality" getContent={() => closeness}/>
            
            {this.draw()}
            {this.state.leader!=="" ? this.showLeader(this.state.leader) : null}  
          </div>
        )
        
        
    }
   
  }
export default Network


