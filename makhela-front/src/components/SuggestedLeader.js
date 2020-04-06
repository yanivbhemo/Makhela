import React from 'react';
import { UserCard } from 'react-ui-cards';
import SuggestedLeader from './Leader' 

class MoDSpecialist extends React.Component {
  constructor() {
    super();
      this.state = {
          chosen: '',
          leaders: [],
          listMode : true
      };
    this.eachSuggested = this.eachSuggested.bind(this);
    this.add = this.add.bind(this)
    this.nextID = this.nextID.bind(this)
    this.renderList = this.renderList.bind(this)
    // this.renderData = this.renderData.bind(this)
    this.nehandleClickxtID = this.handleClick.bind(this)
  }
  
 
  handleClick(i) {
    this.setState({listMode: false , chosen: this.state.leaders[i]})
    // // e.preventDefault();
    // console.log(this.state.leaders[i]);
    // console.log('The link was clicked.');
  }

 

  eachSuggested(leader, i) {
    console.log()
    return (
        <UserCard key={`suggestedLeader${i}`} index={i}
        onClick={() => this.handleClick(i)}
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

    add({ event = null, id = null, name = 'default', followers = 'default', following = 'default', posts = 'default', avatar = 'default', description = 'default', twitterId = null}) {
      this.setState(prevState => ({
        leaders: [
          ...prevState.leaders, {
            id: id !== null ? id : this.nextID(prevState.leaders),
            name: name,
            followers: followers,
            following: following,
            posts: posts,
            avatar: avatar,
            description: description,
            twitterId: twitterId
          }]
      }))
  }

  nextID(leaders = []) {
      let max = leaders.reduce((prev, curr) => prev.id > curr.id ? prev.id : curr.id , 0)
      return ++max
    } 


  componentDidMount() {
    const url = 'http://localhost:3000/allsuggestions';
    fetch(url)
        .then(res => res.json())
        .then(data => data.map(item =>
            this.add({
              name: item.full_name,
              followers: item.twitter_followers_count,
              following: item.twitter_friends_count,
              posts: item.twitter_statuses_count,
              avatar: item.twitter_profile_image,
              description: item.twitter_description,
              twitterId: item.twitter_id
            })))
        .catch(err => console.error(err));
  }

  renderList() {
    return (
      <div>
        {/* <React.Fragment> */}
            <h1>MOD SPECIALIST</h1>
            <h2>Suggested community members</h2>
            {this.state.leaders.map(this.eachSuggested)}
            {/* {this.state.leaders.filter(this.highCertainty)} */}
        {/* </React.Fragment> */}
        </div>
    )
  }

  renderData() {
    return (
      <div>
       <SuggestedLeader leader = {this.state.chosen}/>
        </div>
    )
  }

  render() {
    return this.state.listMode ? this.renderList() : this.renderData()
  }
}

export default MoDSpecialist