import React from 'react';
import { UserCard } from 'react-ui-cards';
// import SuggestedLeader from './SuggestedLeader'

class MoDSpecialist extends React.Component {
  constructor() {
    super();
      this.state = {
          leaders: []
      };
    this.eachSuggested = this.eachSuggested.bind(this);
    this.add = this.add.bind(this)
    this.nextID = this.nextID.bind(this)
  }
  
  eachSuggested(leader, i) {
    console.log()
    return (
        <UserCard key={`suggestedLeader${i}`} index={i}
          float
          avatar={leader.avatar}
          name={leader.name}
          // positionName={leader.description}
          stats={[
            {
              name: 'followers',
              value: leader.followers
            },
            {
              name: 'following',
              value: leader.following
            },
            {
              name: 'posts',
              value: leader.posts
            }
          ]}
        />)
    }

    add({ event = null, id = null, name = 'default', followers = 'default', following = 'default', posts = 'default', avatar = 'default', description = 'default'}) {
      this.setState(prevState => ({
        leaders: [
          ...prevState.leaders, {
            id: id !== null ? id : this.nextID(prevState.leaders),
            name: name,
            followers: followers,
            following: following,
            posts: posts,
            avatar: avatar,
            description: description
          }]
      }))
  }

  nextID(leaders = []) {
      let max = leaders.reduce((prev, curr) => prev.id > curr.id ? prev.id : curr.id , 0)
      return ++max
    } 


  componentDidMount() {
    const url = 'http://localhost:3000/';
    fetch(url)
        .then(res => res.json())
        .then(data => data.map(item =>
            this.add({
              name: item.full_name,
              followers: item.twitter_followers_count,
              following: item.twitter_friends_count,
              posts: item.twitter_statuses_count,
              avatar: item.twitter_profile_image,
              description: item.twitter_description
            })))
        .catch(err => console.error(err));
  }

  render() {
    return (
      <div>
        {/* <React.Fragment> */}
            <h1>MOD SPECIALIST</h1>
            <h2>Suggested community members</h2>
            {this.state.leaders.map(this.eachSuggested)}
        {/* </React.Fragment> */}
        </div>
    )
  }
}

export default MoDSpecialist