import React from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import ReactTooltip from "react-tooltip";
import { degree, betweenness, closeness } from './ClosenessExp'
import Col from './Col'
import Row from './Row'

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
    this.setState({centrality:centralityState})
    let myNodes 
    switch(this.state.centrality){
            case 'degCentrality':
              myNodes =  this.state.leaders.map(item => { 
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
              myNodes =  this.state.leaders.map(item => { 
                return {id: item.id, value: item.betweennessCentrality , label: item.twitterName, title: item.name, group: item.community }
              })
              break;
            case 'closenessCentrality':
              myNodes =  this.state.leaders.map(item => { 
                return {id: item.id, value: item.degCentrality , label: item.twitterName, title: item.name, group: item.community }
              })
              break;
              default:
                myNodes = [];
          }
          this.setState({nodes:myNodes})
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
    console.log(id)
    let leader = this.state.leaders.find(element => element.id === id);
    if(leader===undefined) 
       return(<h3>This member was not analyzed yet</h3>)
    else 
      return(
      <div>
         <Row>
          <Col className="col-lg-4">
                            {/* <Panel headeline="Graph">
                                <Network />
                            </Panel> */}
                             <div className="profile-pic">
                              <img src={leader.twitterProfileImage} alt="Logo" />;
                           </div>
                        </Col>
                        <Col className="col-lg-3">
                        <div className="col-md-3 profile-text">
                          <h3>{leader.name}</h3>
                          <h5>{leader.twitterName}</h5>
                          <p>followers {leader.followers}</p>
                          <p>followers {leader.following}</p>
                      </div>
                        </Col>
                        <Col className="col-lg-1">
                          <button className="btn btn-theme03" onClick={() => this.fetchPosts()}>Show posts graph</button>
                          <button className="btn btn-theme03" onClick={() => this.fetchPosts()}>Show profile</button>
                        </Col>
                        </Row>
         {/* <div className="profile-pic">
        <img src={leader.twitterProfileImage} alt="Logo" />;
        </div>
      <div className="col-md-3 profile-text">
          <h3>{leader.name}</h3>
          <h5>{leader.twitterName}</h5>
          <p>followers {leader.followers}</p>
          <p>followers {leader.following}</p>
      </div>
      <div className="col-md-3 profile-text">
        <button className="btn btn-theme03" onClick={() => this.fetchPosts()}>Show posts graph</button>
        <button className="btn btn-theme03" onClick={() => this.fetchPosts()}>Show profile</button>
      </div> */}
    </div>
    )
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
                console.log(nodes[0])
                console.log(this.state.leaders)
                this.setState({leader : nodes[0]})
            }
    };
    return <Graph
                graph={graph}
                options={options}
                events={events}
                getNetwork={network => {
                }}
              />
  }  
  componentDidMount() {
    const url = 'https://makhela-graph.herokuapp.com/getLeaders';
    fetch(url)
        .then(res => res.json())
        .then(data => { 
          this.setState({ leaders: data })
          let myNodes = []
          this.state.leaders.map(item => myNodes.push({id: item.id, value: item.closenessCentrality , label: item.twitterName, title: "ddd", group: item.community, shape: "dot" }))
          let myEdges = []
          this.state.leaders.map(value => {
              if(Array.isArray(value.communityFollowing))
                  value.communityFollowing.map(fl => myEdges.push({ from: value.id, to: fl}))
             });
          this.setState({nodes: myNodes, edges: myEdges, loading: false})              
      })
        .catch(err => console.error(err));
  }

  render() {
      if(this.state.loading)
        return <h1>Graph loading</h1>
      else
        return(
          <div>
            <button  data-for="degCentrality" style={{marginRight: "10px", marginBottom:"10px"}} className="btn btn-theme03" data-tip onClick={() => this.centrality('degCentrality')}>Degree Centrality</button>
            <ReactTooltip type="warning" id="degCentrality" getContent={() => degree}/>
           
            <button  data-for="betweennessCentrality" style={{marginRight: "10px", marginBottom:"10px"}} className="btn btn-theme03" data-tip  onClick={() => this.centrality('betweennessCentrality')}>Betweenness Centrality</button>
            <ReactTooltip type="warning" id="betweennessCentrality" getContent={() => betweenness}/>

            <button data-for="closenessCentrality" style={{marginRight: "10px", marginBottom:"10px"}} className="btn btn-theme03" data-tip onClick={() => this.centrality('closenessCentrality')}>Closeness Centrality</button>
            <ReactTooltip type="warning" id="closenessCentrality" getContent={() => closeness}/>
            
            {this.draw()}
            {this.state.leader!=="" ? this.showLeader(this.state.leader) : null}  
          </div>
        )
        
        
    }
   
  }
export default Network


