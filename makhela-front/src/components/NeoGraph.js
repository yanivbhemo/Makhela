// import React, { Component } from "react";
// import ResizeAware from "react-resize-aware";
// import PropTypes from "prop-types";
 
// class NeoGraph extends Component {
//   constructor(props) {
//     super(props);
//     this.visRef = React.createRef();
//     this.showGraph = this.showGraph.bind(this);
//     this.handleClick = this.handleClick.bind(this);
//     this.element = React.createRef()
//   }


//   handleClick(){
//     alert("hi")
//   }


//   componentDidUpdate(prevProps){
//     if(this.props.cypher !== prevProps.cypher)
//       this.showGraph()

// }
//   componentDidMount(){
//     this.showGraph()
//     this.element.current.addEventListener('click', this)

// }
//   showGraph() {
//     const { neo4jUri, neo4jUser, neo4jPassword, cypher } = this.props;
//     // console.log(cypher)
//     // var cypherQuery = "MATCH p=(:Leader)-[:FOLLOWS]-(:Leader)-[:TWEETED]-(:Post)-[:RETWEETED]-(:Leader) RETURN p"
//     var cypherQuery = cypher
//     switch(cypher){
//       case "tweet":
//         cypherQuery =  "MATCH p=(:Leader)-[:FOLLOWS]-(:Leader)-[:TWEETED]-(:Post)-[:RETWEETED]-(:Leader) RETURN p"
//         break
//       case "follow":
//         cypherQuery = "MATCH p=(:Leader)-[:FOLLOWS]->(:Leader) RETURN p" 
//         break
//       case "full":
//         cypherQuery = "MATCH p=(:Leader)-[:TWEETED]->(:Post) RETURN p"
//         break

//     }
//     const config = {
//       container_id: this.visRef.current.id,
//       server_url: neo4jUri,
//       server_user: neo4jUser,
//       server_password: neo4jPassword,
//       labels: {
//         Leader: {
//           caption: "full_name",
//           size: "pagerank",
//           // size: "centrality",
//           // size: "centrality_closenes",
//           // size:"centrality_harmonic",
//           // size: "eigenvector",
//           "title_properties": [
//             "full_name",
//             "pagerank"
//         ],
//       },
//         Post: {
//           // caption: false,
//           // size:0.2,
//         }
//       },
//       relationships: {
//         TWEETED: {
//           caption: true,
//           thickness: "count",
//         },
//         FOLLOWS: {
//           caption: false,
//           thickness: "count",
//         },
//         RETWEETED: {
//           caption: true,
//           thickness: "count"
//         }
//       },
//       initial_cypher: cypherQuery,
//       arrows: true,
//     };
//     /*
//       Since there is no neovis package on NPM at the moment, we have to use a "trick":
//       we bind Neovis to the window object in public/index.html.js
//     */
   
//     // this.vis = new window.NeoVis.default(config);
//     // this.vis.render();
//     // Neovis.stabilize()

//   }
//   // registerClickEvent(viz){
//   //   // viz.registerOnEvent("completed", (e)=>{
//   //   //   viz["_network"].on("click", (event)=>{
//   //       alert("clicked")
//   //       // ... do something with event ..
//   //       // event.nodes[0] or event.edges[0] have id of node or edge  clicked
//   //       // you can get data of node data as viz["_nodes"][event.nodes[0]], similarly do for edges
//   //       // });
//   //     // });
//   //   }

//   render() {
//     const { width, height, containerId, backgroundColor } = this.props;
//     return (
//       <div  ref={this.element}>
//         <h3 onClick={this.handleClick}>some</h3>
//       <div
//         id={containerId}
//         ref={this.visRef}
//         style={{
//           width: `${width}px`,
//           height: `${height}px`,
//           backgroundColor: `${backgroundColor}`
//         }}
//       />
//       </div>
//     );
//   }
// }

// NeoGraph.defaultProps = {
//   width: 600,
//   height: 600,
//   backgroundColor: "#d3d3d3"
// };

// NeoGraph.propTypes = {
//   width: PropTypes.number.isRequired,
//   height: PropTypes.number.isRequired,
//   containerId: PropTypes.string.isRequired,
//   neo4jUri: PropTypes.string.isRequired,
//   neo4jUser: PropTypes.string.isRequired,
//   neo4jPassword: PropTypes.string.isRequired,
//   backgroundColor: PropTypes.string
// };

// class ResponsiveNeoGraph extends Component {
//   state = {
//     width: 400,
//     height: 400
//   };

//   handleResize = ({ width, height }) => {
//     // console.log("resize", width, height);
//     const side = Math.max(width, height) / 2;
//     this.setState({
//       width: side,
//       height: side
//     });
//   };

//   render() {
//     const responsiveWidth = this.state.width;
//     const responsiveHeight = this.state.height;
//     const neoGraphProps = {
//       ...this.props,
//       width: responsiveWidth,
//       height: responsiveHeight
//     };
//     return (
//       <ResizeAware
//         style={{ position: "relative" }}
//         onlyEvent
//         onResize={this.handleResize}
//       >
//         <NeoGraph {...neoGraphProps} />
//       </ResizeAware>
//     );
//   }
// }

// const responsiveNeoGraphDefaultProps = Object.keys(NeoGraph.defaultProps)
//   .filter(d => d !== "width" && d !== "height")
//   .reduce((accumulator, key) => {
//     return Object.assign(accumulator, { [key]: NeoGraph.defaultProps[key] });
//   }, {});

// ResponsiveNeoGraph.defaultProps = {
//   ...responsiveNeoGraphDefaultProps
// };

// const responsiveNeoGraphPropTypes = Object.keys(NeoGraph.propTypes)
//   .filter(d => d !== "width" && d !== "height")
//   .reduce((accumulator, key) => {
//     return Object.assign(accumulator, { [key]: NeoGraph.propTypes[key] });
//   }, {});

// ResponsiveNeoGraph.propTypes = {
//   ...responsiveNeoGraphPropTypes
// };

// export { NeoGraph, ResponsiveNeoGraph };
