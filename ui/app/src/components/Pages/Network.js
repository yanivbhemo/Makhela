import React from "react";
import Graph from "react-graph-vis";

class Network extends React.Component {
  constructor() {
    super();
      this.state = {
        loading: true,
        clicked: false,
        leaderGraph: true,
        leaders: [],
        leader: '',
        postGraph: false,
        posts:   [],
        post: '',
        nodes: [],
        edges: [],
      };
      this.draw = this.draw.bind(this)
      this.fetchPosts = this.fetchPosts.bind(this)
      this.show = this.show.bind(this)
      this.showLeader = this.showLeader.bind(this)
      this.showPost = this.showPost.bind(this)   
  }

  componentDidMount() {
    const url = 'http://localhost:3000/getLeaders';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        this.setState({ leaders: data })
        let mynodes = this.state.leaders.map(item => {
          return {id: item.id, label: item.twitterName, title: item.name+"<br>"+item.community, value: item.degCentrality, group: item.community }
        })
        let myEdges = []
        this.state.leaders.map(item => {
          if(Array.isArray(item.communityFollowing)){
            item.communityFollowing.map(value => myEdges.push({ from: item.id, to: value})
            )
          }
        })
        this.setState({nodes: mynodes, edges: myEdges, loading: false})              
      })
      .catch(err => console.error(err));
  }

  draw(){
    const graph = {
      nodes: this.state.nodes,
      edges: this.state.edges
    }
    const options = {
      physics: {
        maxVelocity: 146,
        solver: "forceAtlas2Based",
        timestep: 0.35,
        stabilization: { iterations: 1 }
      },
      nodes: {
        shape: "dot",
        scaling: {
          customScalingFunction: (min, max, total, value) => {
            return value / total;
          },
          min: 10,
          max: 150
        }
        // size: 8
      },
      edges: {
        color: { inherit: true },
        smooth: {
          type: "continuous",
          forceDirection: "none",
          roundness: 0.5
        },
      },
      layout: {
        randomSeed: 34,
        hierarchical: false
      },
      height: "500px", 
    }
    const events = {
      select: (event) => {
        var { nodes, edges } = event
        if(this.state.leaderGraph){
          if(nodes[0])
            this.setState({leader: nodes[0], clicked: true})
        }
        else if(this.state.postGraph){
          if(nodes[0]){
            this.setState({post: nodes[0]})
          }
            
        }
      }
    }
    return <Graph graph={graph} options={options} events={events}/>
  }

  fetchPosts(){
    this.setState({loading: true, postGraph: true, leaderGraph: false})
    let formBody = "leader="+this.state.leader
    const url = 'http://localhost:3000/allposts'

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
    .catch(err => console.error(err))
  }

  show(){
    if(this.state.post !== ''){
      let post = this.state.posts.find(element => element.postId === this.state.post);
      console.log(post)

      return(
        <React.Fragment>
          {/* <h1>name: {post.fullText}</h1> */}
          <button onClick={() => this.fetchPosts()}>Show posts graph</button>
      </React.Fragment>
      )
    }
    else{
      let leader = this.state.leaders.find(element => element.id === this.state.leader);
    return(
      <React.Fragment>
        <h1>name: {leader.name}</h1>
        <h1>twitter name: {leader.twitterName}</h1>
        <h1>followers: {leader.followers}</h1>
        <h1>following: {leader.following}</h1>   
        <button onClick={() => this.fetchPosts()}>Show posts graph</button>
      </React.Fragment>
    )
    }
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
  }

  showPost(id){
    let post = this.state.posts.find(element => element.postId === id);
    return(
      <React.Fragment>
        {/* <h1>name: {post.fullText}</h1> */}
        <button onClick={() => this.fetchPosts()}>Show posts graph</button>
    </React.Fragment>
    )
  }

  render() {
    if(this.state.loading)
      return <h1>Graph loading</h1>
    else
      return(
        <div>
          {this.draw()}
          {/* {this.state.leader!=="" ?  this.showPost(this.state.post): this.showLeader(this.state.leader)}        */}
          {this.state.clicked ? this.show() : " " }
        </div>
      )
  }
   
}
export default Network
