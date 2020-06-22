import React, { Component } from 'react'
import * as CONSTS from '../consts'
import Cookies from 'js-cookie';

class Topics extends Component {
    constructor() {
        super()
        this.state = {
            topics: '',
            colors: {
                0: { color: "#FF9900" },// orange 
                1: { color: "#7c5295" },// purple
                2: { color: "#C5000B" },// blue
                3: { color: "#2B7CE9" },// red
                4: { color: "#FF9900" },// pink
                5: { color: "#006400" },// green
                6: { color: "#7D4219" },// brown
              },
          }
        this.showNetwork = this.showNetwork.bind(this)
        this.showCommunities = this.showCommunities.bind(this)
    }

    showNetwork(){
        if(this.state.topics.network)
            return(
                <React.Fragment>
                {this.state.topics.network.map(topic =>
                    <div>
                        <sapn> ❏</sapn>
                        {topic.map(item => <sapn> {item} |</sapn>)}
                    </div>
                )}</React.Fragment>
            )
    }

    showCommunities(){
        if(this.state.topics.communities){
        let counter = -1
            return(
                <div>{this.state.topics.communities.map(community => {
                    counter++
                    let curColor = this.state.colors[this.state.topics.communitiesIndex[counter]]
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
        body: JSON.stringify({
          "token":Cookies.get('token'),
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
    .then(res => res.json())
    .then(data => {
        this.props.onChange(data[0].date)
        this.setState({
            topics: data[0]
        })
    }
        
        )
    .catch(err => console.error(err));
    }

    render() {
        return(
            <React.Fragment>
                {this.showNetwork()}
                {this.showCommunities()}
            </React.Fragment>
        )
    }
}
export default Topics;