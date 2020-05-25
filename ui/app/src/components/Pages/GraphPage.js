import React, { Component } from 'react'
import Content from '../Content'
import Row from '../Row'
import Col from '../Col'
import Panel from '../Panel'
import Header from '../Header'
import Menu from '../Menu'
import Footer from '../Footer'
import CommunityPanel from '../Panels'
import {PostsPanel, HealthPanel, LeaderPanel} from '../Panels'
import Network from '../Network'
import Topics from '../Topics'
import Posts from '../Posts'

class GraphPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 'leaders',
            leader: '',
            nickName: '',
            followers: '',
            following: '',
            twitterProfileImage: ''
          };
    this.update = this.update.bind(this)
    this.showPostsGraph = this.showPostsGraph.bind(this)
    }
    update(leader, nickName, followers, following, twitterProfileImage){
        console.log(twitterProfileImage)
        this.setState({
            leader: leader,
            nickName: nickName,
            followers: followers,
            following: following,
            twitterProfileImage: twitterProfileImage
        })
        console.log(this.state.leader, this.state.nickName)
    }

    showPostsGraph(){
        this.setState({
            page: 'post',
        })
    }

    componentDidMount() {
        document.title = "Main Graph"
    }

    render() {
        return(
            <React.Fragment>
                <Header />
                <Menu />
                <Content title="Main Graph" fa="fa-home">
                    <Row>
                        <Col className="col-lg-8">
                            <Panel headeline="Graph">
                                {this.state.page==='leaders'?   <Network onChange={this.update}/>:
                                <div>
                                     <button className="btn btn-theme03" onClick={() => this.setState({page:'leaders'})}>Back to network</button>
                                     <Posts leader={this.state.leader} leaderName={this.state.nickName}/>
                                </div>
                                }
                                {/* <Network /> */}
                            </Panel>
                        </Col>
                        {/* SWITCH TO COMPONENT */}
                        <Col className="col-lg-4">
                            {this.state.leader?  <Panel headeline="Opinion Leader">
                                {/* <div className="col-md-4 profile-text"> */}
                                <LeaderPanel 
                                    key={this.state.leader}
                                    index= {this.state.leader}
                                    full_name={this.state.nickName}
                                    twitter_id={this.state.leader}
                                    twitter_profile_image={this.state.twitterProfileImage}
                                    twitter_description="desc"
                                    twitter_screen_name={this.state.nickName}
                                    level_of_certainty={10}
                                    twitter_followers_count={this.state.followers}
                                    twitter_created_at=""
                                    // onBlackListBtn={this.moveToBlackList}
                                    newUser={true}
                                    />
                                    <button className="btn btn-theme03" onClick={() => this.showPostsGraph()}>Show posts graph</button>
                                    <button className="btn btn-theme03" onClick={() => this.setState({leader:'', nickName:''})}>Close</button>
                                {/* </div> */}
                            </Panel> : <div></div>}
                        </Col>
                        <Col className="col-lg-4">
                            <Panel headeline="Topics">
                                <div className="col-md-12 profile-text">
                                    <Topics/>
                                </div>
                            </Panel>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col className="col-lg-12">
                            <Panel headeline="Toolbar">
                                Test
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-md-4 col-sm-4 mb">
                            <CommunityPanel />
                        </Col>
                        <Col className="col-md-4 col-sm-4 mb">
                            <PostsPanel />
                        </Col>
                        <Col className="col-md-4 col-sm-4 mb">
                            <HealthPanel />
                        </Col>
                    </Row>
                </Content>
                <Footer />
            </React.Fragment>
        )
    }
}

export default GraphPage;