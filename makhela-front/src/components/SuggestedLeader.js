import React from 'react';
import { UserCard } from 'react-ui-cards';
import { ListGroup, Card } from 'react-bootstrap';

class SuggestedLeader extends React.Component {
  constructor() {
    super();
      this.state = {
        avatar: 'https://i.imgur.com/uDYejhJ.jpg',
        name: "Sveta",
        following: 50,
        followers: 200,
        posts: 20
      };
    // this.showChart = this.showChart.bind(this);
  }
 
 
 
// componentDidMount() {
//     const url = 'https://women-in-media-back.herokuapp.com/';
//     fetch(url)
//         .then(res => res.json())
//         .then(data => {
//           let dataNew = {
//             female: data.female,
//             flag: data.flag,
//             mako: data.mako,
//             words: data.words
//           }
//           this.setState(dataNew);
//         })
//         .catch(err => console.error(err));
// }

  render() {
    return (
      <React.Fragment>
        <UserCard
          float
          avatar={this.state.avatar}
          name={this.state.name}
        //   positionName='Software Developer'
          stats={[
            {
              name: 'followers',
              value: this.state.followers
            },
            {
              name: 'following',
              value: this.state.following
            },
            {
              name: 'posts',
              value: this.state.posts
            },
            // {
            //   name: 'topics',
            //   value: 'Nuecleer'
            // },
            // {
            //   name: 'location',
            //   value: 'Israel'
            // }
          ]}
        />
        
      <ListGroup>
        <ListGroup.Item>Post 1</ListGroup.Item>
        <ListGroup.Item>Post 2</ListGroup.Item>
        <ListGroup.Item>Post 3</ListGroup.Item>
        <ListGroup.Item>Post 4</ListGroup.Item>
        <ListGroup.Item>Post 5</ListGroup.Item>
        <ListGroup.Item>Post 6</ListGroup.Item>
        <ListGroup.Item>Post 7</ListGroup.Item>
        <ListGroup.Item>Post 8</ListGroup.Item>
      </ListGroup>
  
      </React.Fragment>
    )
  }
}

export default SuggestedLeader