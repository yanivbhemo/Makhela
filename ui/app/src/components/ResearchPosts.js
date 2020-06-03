import React from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import ReactTooltip from "react-tooltip";
import { degree, betweenness, closeness } from './ClosenessExp'
import Col from './Col'
import Row from './Row'
import * as CONSTS from '../consts'
import Cookies from 'js-cookie';

class ResearchPosts extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
          post: ''
      };
      this.draw = this.draw.bind(this)
  }

  draw(){
      let nodes = []
      let edges = []
      let i = 0
      this.props.words.map(word =>{
          nodes.push({id: i, label: word, title: word, group:1, value: 500})
          i++
    })
    this.props.posts.map(post =>{
        try{
            nodes.push({id: post.postId, title: post.fullText ,group:0, value: post.likes})
        for(let i=0; i<this.props.words.length; i++){
            if(post.word.includes(this.props.words[i])){
                edges.push({ from: i, to: post.postId})

            }
            
        }}
        catch(err){
            console.log(err)
        }
            
    })

    const graph = {
      nodes: nodes,
      edges: edges
    };
    const options = {
      physics: {
        maxVelocity: 146,
        solver: "forceAtlas2Based",
        timestep: 0.35,
        stabilization: { iterations: 1 }
      },
      groups: {
        1: { color: "#FF9900" },// orange 
        0: { color: "#7c5295" },// purple
      },
      layout: {
        randomSeed: 34,
        hierarchical: false,
        improvedLayout: false
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
        color: { inherit: "to" },
      },
      height: "400px", 
      }
   
    const events = {
      select: (event) => {
              const { nodes, edges } = event;
              if(nodes[0]){
                const found = this.props.posts.find(element => element.postId === nodes[0]);
                if(found){
                    this.setState({post:found})
                    console.log(found)
                    this.props.onChange(found.leader)
                }
                    
              }
            }
    };
    return (<React.Fragment>
       
          <Graph
                  graph={graph}
                  options={options}
                  events={events}
                  getNetwork={network => {
                  }}
                />
                {this.state.post!==''?
                <div>
                    <h4>Tweet:"{this.state.post.fullText}"</h4>
                    <h5>Likes:{this.state.post.likes} | Retweets:{this.state.post.retweetCount}</h5>
                </div>
                :
                <div></div>
            }
          </React.Fragment>)
  }  
  

  render() {
        return(
          <React.Fragment>
            {this.draw()}
          </React.Fragment>
        )
  }
}
export default ResearchPosts