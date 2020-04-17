import React from "react";
import ReactDOM from "react-dom";
import Graph from "react-graph-vis";
import MyNetwork from './Graph'

class Network extends React.Component {
  constructor() {
    super();
      this.state = {
          leaders: []
      };
      this.add = this.add.bind(this)
  }

  add({ event = null, twitter_id = null, name = 'default', followers = 'default', following = 'default', twitterName = 'default', communityFollowing = 'default'}) {
    this.setState(prevState => ({
      leaders: [
        ...prevState.leaders, {
          id: twitter_id,
          name: name,
          followers: followers,
          following: following,
          twitterName: twitterName,
          communityFollowing: communityFollowing,
        }]
    }))
}

  componentDidMount() {
    const url = 'http://localhost:3000/getLeaders';
    fetch(url)
        .then(res => res.json())
        .then(data => data.map(item =>
            this.add({
              twitter_id: item.twitter_id,
              name: item.full_name,
              followers: item.twitter_followers_count,
              following: item.twitter_friends_count,
              twitterName: item.twitter_screen_name,
              communityFollowing: item.community_following,
            })))
        .catch(err => console.error(err));
  }

  render() {
    var myEdges = [];
    var myNodes = this.state.leaders.map(item => { 
        return {id: item.id, label: item.twitterName, title: item.name }
      })
    this.state.leaders.map(value => {
        if(Array.isArray(value.communityFollowing)){
            value.communityFollowing.map(fl => {
                myEdges.push({ from: value.id, to: fl})
            })
        }
        });
        
      return (
        // <h1>hi</h1>
        <MyNetwork nodes={myNodes} edges={myEdges}/>
      );
    }
   
  }

export default Network
