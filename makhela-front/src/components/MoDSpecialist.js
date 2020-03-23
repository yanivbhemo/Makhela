import React from 'react';
import { UserCard } from 'react-ui-cards';
// import SuggestedLeader from './SuggestedLeader'

class MoDSpecialist extends React.Component {
  constructor() {
    super();
      this.state = {
          leaders: [
            {
                avatar: 'https://i.imgur.com/uDYejhJ.jpg',
                name: "Sveta",
                following: 50,
                followers: 200,
                posts: 20
            },
            {
                avatar: 'https://i.imgur.com/uDYejhJ.jpg',
                name: "yaniv",
                following: 70,
                followers: 100,
                posts: 50
            },
            {
                avatar: 'https://i.imgur.com/uDYejhJ.jpg',
                name: "Sveta",
                following: 50,
                followers: 200,
                posts: 20
            },
            {
                avatar: 'https://i.imgur.com/uDYejhJ.jpg',
                name: "yaniv",
                following: 70,
                followers: 100,
                posts: 50
            },
            {
                avatar: 'https://i.imgur.com/uDYejhJ.jpg',
                name: "Sveta",
                following: 50,
                followers: 200,
                posts: 20
            },
            {
                avatar: 'https://i.imgur.com/uDYejhJ.jpg',
                name: "yaniv",
                following: 70,
                followers: 100,
                posts: 50
            }
          ]
      };
    this.suggestList = this.suggestList.bind(this);
  }
 
  suggestList(leader, i) {
    return (
        <UserCard key={`suggestedLeader${i}`} index={i}
          float
          avatar={leader.avatar}
          name={leader.name}
        //   positionName='Software Developer'
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
            <h1>MOD SPECIALIST</h1>
            <h2>Suggested community members</h2>
            {this.state.leaders.map(this.suggestList)}
        </React.Fragment>
    )
  }
}

export default MoDSpecialist