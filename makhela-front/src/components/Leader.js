import React from 'react';
import { UserCard } from 'react-ui-cards';
import { ListGroup, Card } from 'react-bootstrap';

class SuggestedLeader extends React.Component {
  constructor(props) {
    super(props);
      this.state = {
        posts: []
      };
    this.add = this.add.bind(this);
    this.nextID = this.nextID.bind(this);
    this.eachPost = this.eachPost.bind(this);
  }
 
  eachPost(post, i) {
    return (
    <ListGroup.Item  key={`post${i}`} index={i} >{post.full_text}</ListGroup.Item>
    )}

  add({ event = null, id = null, full_text = null}) {
    this.setState(prevState => ({
      posts: [
        ...prevState.posts, {
          id: id !== null ? id : this.nextID(prevState.posts),
          full_text: full_text,
        }]
    }))
}
 

nextID(posts = []) {
  let max = posts.reduce((prev, curr) => prev.id > curr.id ? prev.id : curr.id , 0)
  return ++max
} 

componentDidMount() {
  let twitterId = this.props.leader.twitterId
  const url = 'http://localhost:3000/allposts';    
  fetch(url, {
   method: 'POST',
   headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
  body: "leader="+twitterId.toString(10)
  })
  .then(res => res.json())
  .then(data => data.map(item => 
    this.add({
      full_text: item.full_text,
      // followers: item.twitter_followers_count,
      // following: item.twitter_friends_count,
      // posts: item.twitter_statuses_count,
      // avatar: item.twitter_profile_image,
      // description: item.twitter_description,
      // twitterId: item.twitter_id
    })
    ))
  .catch(err => console.error(err));
 };


  render() {
    console.log(this.props)
    return (
      <React.Fragment>
        <UserCard
          float
          avatar={this.props.leader.avatar}
          name={this.props.leader.name}
        //   positionName='Software Developer'
          stats={[
            {
              name: 'followers',
              value: this.props.leader.followers
            },
            {
              name: 'following',
              value: this.props.leader.following
            },
            {
              name: 'posts',
              value: this.props.leader.posts
            },
          ]}
        />
        
      <ListGroup>
        {this.state.posts.map(this.eachPost)} 
      </ListGroup>
  
      </React.Fragment>
    )
  }
}

export default SuggestedLeader