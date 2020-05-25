import React from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import ReactTooltip from "react-tooltip";
import { degree, betweenness, closeness } from './ClosenessExp'
import Col from './Col'
import Row from './Row'
import * as CONSTS from '../consts'
import Cookies from 'js-cookie';

class Posts extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        loading: true,
        posts: [],
        nodes: [],
        edges: [],
        leader: '',
        post: '',
        link: ''
      };
      this.draw = this.draw.bind(this)
  }

  componentDidMount() {
    this.setState({loading: true})
    let formBody = "leader="+this.props.leader
    const url = CONSTS.GET_GRAPH_POSTS

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

          mynodes.push({id: this.props.leader, label: this.props.leaderName,
          size: 100})
          this.state.posts.map(item => { 
            mynodes.push({
                          id: item.postId.toString(), 
                          // color: "#86A3C3",
                          shape: "dot",
                          title: `<div style="padding:10px;background-color:black">
                                  <p style="color:blue">${item.fulText}</p>
                                  <p style="color:green">${item.dateCreated.toString()}</p>
                                <div/>` ,
                          // group: item.community
                          value: item.likes,
                          group: item.keyWords
                          
                        })
            myEdges.push({ from: this.props.leader, to: item.postId.toString(), value:item.retweetCount})
          })

          this.setState({nodes: mynodes, edges: myEdges, loading: false})       
      })
        .catch(err => console.error(err));
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
            max: 50
        },
        font: { size: 12, face: "Tahoma" }
      },
      edges: {
        smooth: {
          type: "continuous",
          forceDirection: "none",
          roundness: 0.5
        },
        scaling: {
          customScalingFunction: (min, max, total, value) => {return value / total},
            min: 1,
            max: 30
        },
        color: { inherit: "from" },
      },
      height: "400px", 
      }
   
    const events = {
      select: (event) => {
              var { nodes, edges } = event;
              if(nodes[0]){
                let found = this.state.posts.find(element => element.postId.toString() === nodes[0]);
                if(found)
                {
                  let link = `https://twitter.com/${this.props.leaderName}/status/${found.postId}`
                  this.setState({post:found.fulText, link:link})
                }
              }
            }
    };
    return <React.Fragment>
          <Graph
                  graph={graph}
                  options={options}
                  events={events}
                  getNetwork={network => {
                  }}
                />
              <a href={this.state.link} >{this.state.post}</a>
          </React.Fragment>
  }  
  

  render() {
      if(this.state.loading)
        return <h1>Graph loading</h1>
      else
        return(
          <div>
            {this.draw()}
          </div>
        )
        
        
    }
   
  }
export default Posts


