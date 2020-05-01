import React, { Component } from 'react'
import Content from '../Content'
import Row from '../Row'
import Col from '../Col'
import Panel from '../Panel'
import Header from '../Header'
import Menu from '../Menu'
import Footer from '../Footer'
import { LeaderPanel } from '../Panels'
import * as CONSTS from '../../consts'


const filter_button_style = {
    paddingRight: "10px"
};


class CommunityPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leaders: [],
            loadingActive: true
        }
        
        this.add = this.add.bind(this)
        this.eachLeader = this.eachLeader.bind(this)
        this.moveToBlackList = this.moveToBlackList.bind(this)
    }

    componentDidMount() {
        document.title = "Community"
        const url = CONSTS.GET_ALL_LEADERS
        fetch(url)
        .then(res => res.json())
        .then(data => data.map(leader => this.add({
            full_name: leader.full_name, 
            twitter_id: leader.twitter_id, 
            twitter_profile_image: leader.twitter_profile_image,
            twitter_description: leader.twitter_description,
            twitter_screen_name: leader.twitter_screen_name,
            twitter_created_at: leader.twitter_created_at,
            level_of_certainty: leader.level_of_certainty,
            twitter_followers_count: leader.twitter_followers_count
        })))
        .catch(err => console.log(err))
    }

    add({ event = null, full_name,twitter_id,twitter_profile_image,twitter_description,twitter_screen_name,twitter_created_at,level_of_certainty,twitter_followers_count}) {
        this.setState(prevState => ({
            leaders: [
                ...prevState.leaders,
                {
                    full_name: full_name, 
                    twitter_id: twitter_id, 
                    twitter_profile_image: twitter_profile_image,
                    twitter_description: twitter_description,
                    twitter_screen_name: twitter_screen_name,
                    twitter_created_at: twitter_created_at,
                    level_of_certainty: level_of_certainty,
                    twitter_followers_count: twitter_followers_count
                }
            ],
            loadingActive: false
        }))
    }

    moveToBlackList(twitter_id){
        console.log(twitter_id)
        const url = CONSTS.MOVE_LEADER_TO_BLACKLIST+"/"+twitter_id
        fetch(url)
        .then(res =>{
            console.log(res)
        })
        .catch(err => console.log(err))
    }

    eachLeader(leader, i) {
        return(
            <Col className="col-md-4 mb" key={`Col${i}`} >
                <LeaderPanel 
                key={`panel${i}`} 
                index={leader.twitter_id}
                full_name={leader.full_name}
                twitter_id={leader.twitter_id}
                twitter_profile_image={leader.twitter_profile_image}
                twitter_description={leader.twitter_description}
                twitter_screen_name={leader.twitter_screen_name}
                level_of_certainty={leader.level_of_certainty}
                twitter_followers_count={leader.twitter_followers_count}
                twitter_created_at={leader.twitter_created_at.substring(0,10)}
                onBlackListBtn={this.moveToBlackList}
                >
                </LeaderPanel>
            </Col>
        )
    }

    render() {
        return(
            <React.Fragment>
                <Header />
                <Menu />
                <Content title="Community" fa="fa-users" loadingActive={this.state.loadingActive}>
                    <Row>
                        <Col className="col-lg-12">
                            <Panel>
                                <a href="add_leader.html"><button type="button" className="btn btn-success">Add a leader</button></a>
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-lg-12">
                            <Panel>
                                <strong style={filter_button_style}>Filters: </strong>
                                <div className="btn-group">
                                    <button type="button" className="btn btn-theme03">Action</button>
                                    <button type="button" className="btn btn-theme03 dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                        <span className="caret"></span>
                                        <span className="sr-only">Toggle Dropdown</span>
                                        </button>
                                    <ul className="dropdown-menu" role="menu">
                                        <li><a href="#">Action</a></li>
                                        <li><a href="#">Another action</a></li>
                                        <li><a href="#">Something else here</a></li>
                                        <li className="divider"></li>
                                        <li><a href="#">Separated link</a></li>
                                    </ul>
                                </div>
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <div className="leadersList">
                            {
                            this.state.leaders.map(this.eachLeader)
                            }
                        </div>
                    </Row>
                </Content>
                <Footer />
            </React.Fragment>
        )
    }
}

export default CommunityPage;