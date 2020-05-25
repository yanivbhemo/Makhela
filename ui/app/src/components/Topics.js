import React, { Component } from 'react'
import * as CONSTS from '../consts'

class Topics extends Component {
    constructor() {
        super()
        this.state = {
            after: ''
          }
        this.showNetwork = this.showNetwork.bind(this)
        this.showCommunities = this.showCommunities.bind(this)
    }

    showNetwork(){
        if(this.state.after.network)
            return(
                <div>{this.state.after.network.map(topic =>
                    <div>
                        <sapn> -></sapn>
                        {topic.map(item => <sapn> {item} |</sapn>)}
                    </div>
                )}</div>
            )
    }

    showCommunities(){
        if(this.state.after.communities)
            return(
                <div>{this.state.after.communities.map(community => 
                    <span>
                        <h4>community</h4>
                        {community.map(topic =>
                    <div>
                        <sapn> -></sapn>
                        {topic.map(item => <sapn> {item} |</sapn>)}
                    </div>
                )}
                    </span>    
                )}</div>
            )
    }

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