import React from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";

class Network extends React.Component {
  constructor() {
    super();
      this.state = {
        leaders: [],
        loading: true,
        posts: [],
        nodes: [],
        edges: [],
        leader: ''
      };
      this.draw = this.draw.bind(this)
      this.showLeader = this.showLeader.bind(this)
      this.fetchPosts = this.fetchPosts.bind(this)
  }

  fetchPosts(){
    // event.preventDefault()
    this.setState({loading: true})
    let formBody = "leader="+this.state.leader
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

          mynodes.push({id: this.state.leader, color: "#D0312D", size: 30})
          this.state.posts.map(item => { 
            mynodes.push({id: item.postId.toString(), title: item.fulText,color: "#86A3C3" })
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
      //     { id: 1, label: "Node 221", color: "#e04141", title: "node 1 tootip text"},
      edges: this.state.edges
  };
   
  const options = {

    physics: {
      // forceAtlas2Based: {
      //   gravitationalConstant: -26,
      //   centralGravity: 0.005,
      //   springLength: 230,
      //   springConstant: 0.18
      // },
      maxVelocity: 146,
      solver: "forceAtlas2Based",
      timestep: 0.35,
      stabilization: { iterations: 1 }
    },
  
      // physics: false,
      // configure: function(option, path) {
      //   if (path.indexOf("smooth") !== -1 || option === "smooth") {
      //     return true;
      //   }
      //   return false;
      // },
      nodes: {
          shape: "dot",
          size: 8
        },
        layout: {
          randomSeed: 34,
          hierarchical: false
        },
      edges: {
          smooth: {
              type: "continuous",
              forceDirection: "none",
              roundness: 0.5
            },
        // color: "#86A3C3"
      },
      height: "600px", 
    };
   
    const events = {
      select: (event) => {
              var { nodes, edges } = event;
              if(nodes[0])
                this.setState({leader : nodes[0]})
            }
    };
    return   <Graph
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
          var mynodes =  this.state.leaders.map(item => { 
            return {id: item.id, label: item.twitterName, title: item.name }
          })
          var myEdges = []
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
            {this.draw()}
            {this.state.leader!=="" ? this.showLeader(this.state.leader) : null}       
          </div>
        )
        
        
    }
   
  }
export default Network


