import React, { Component } from 'react'
import * as CONSTS from '../consts'

class Topics extends Component {
    constructor() {
        super()
        this.state = {
            after: '',
            colors: {
                // 0: { color: "#FF9900" },// orange 
                0: { color: "#7c5295" },// purple
                1: { color: "#2B7CE9" },// blue
                2: { color: "#C5000B" },// red
                3: { color: "#FF9900" },// pink
                4: { color: "#006400" },// green
                5: { color: "#7D4219" },// brown
              },
          }
        this.showNetwork = this.showNetwork.bind(this)
        this.showCommunities = this.showCommunities.bind(this)
    }

    showNetwork(){
        if(this.state.after.network)
            return(
                <React.Fragment>
                {/* <p>Network topics</p> */}
                {this.state.after.network.map(topic =>
                    
                    <div>
                        <sapn> ❏</sapn>
                        {topic.map(item => <sapn> {item} |</sapn>)}
                    </div>
                )}</React.Fragment>
            )
    }

    showCommunities(){
        if(this.state.after.communities){
        let counter = -1
            return(
                <div>{this.state.after.communities.map(community => {
                 
                    counter++
                    let curColor = this.state.colors[counter]
                    return (
                    <span style={curColor}>
                        {community.map(topic =>
                    <div>
                        <sapn> ❏</sapn>
                        {topic.map(item => <sapn> {item} |</sapn>)}
                    </div>
                )}
                    </span>    
                    
                    )
                    
                    
                })}</div>
            )
    }}

    componentDidMount() {
    const url = CONSTS.GET_TOPICS

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    //   body: formBody
    })
    .then(res => res.json())
    .then(data => {
        console.log(data)
        this.setState({
            after: data[1]
        })
    }
        
        )
    .catch(err => console.error(err));
    }

    render() {
        console.log("before", this.state.before)
        console.log("after", this.state.after)
        return(
            <React.Fragment>
                {this.showNetwork()}
                {this.showCommunities()}
            </React.Fragment>
        )
    }
}
export default Topics;