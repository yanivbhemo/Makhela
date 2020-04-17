// import React, { Component } from "react";
// import { NeoGraph, ResponsiveNeoGraph } from "./NeoGraph";
// import { Form, Button } from 'react-bootstrap';

// const NEO4J_URI = "bolt://localhost/7687";
// const NEO4J_USER = "neo4j";
// const NEO4J_PASSWORD = "Makhela123";
// class NetwotkGraph extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       cypher : "follow"
//     }
//     this.handleClick = this.handleClick.bind(this);
//   }

//   handleClick(str) {
//     this.setState({cypher: str})
//   }

//   render() {
//     return (     
//         <div>
//         <h1>Network</h1>
//         {/* <ResponsiveNeoGraph
//           containerId={"id0"}
//           neo4jUri={NEO4J_URI}
//           neo4jUser={NEO4J_USER}
//           neo4jPassword={NEO4J_PASSWORD}
//         /> */}
//          <Button onClick={() => this.handleClick("full")}>Full graph</Button>
//          <Button onClick={() => this.handleClick("follow")}>Opinion leader follows opinion leader</Button>
//          <Button onClick={() => this.handleClick("tweet")}>Opinion leader tweets posts</Button>
//         <NeoGraph
//           width={1000}
//           height={800}
//           containerId={"id1"}
//           neo4jUri={NEO4J_URI}
//           neo4jUser={NEO4J_USER}
//           neo4jPassword={NEO4J_PASSWORD}
//           // backgroundColor={"#b2beb5"}
//           backgroundColor={"#222222"}
//           cypher={this.state.cypher}
//           // physics= {{ enabled: false }}
//         />
//       </div>
//     );
//   }
// }

// export default NetwotkGraph;
