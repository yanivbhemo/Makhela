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
                            <Panel headeline="Network">
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
                                    
                                    <button className="btn btn-theme03" style={{marginRight: "10px",  marginTop:"10px"}} onClick={() => this.showPostsGraph()}>Show posts graph</button>
                                    <button className="btn btn-theme03" style={{marginRight: "10px",  marginTop:"10px"}} onClick={() => this.setState({leader:'', nickName:''})}>Close</button>
                                {/* </div> */}
                            </Panel> : <div></div>}
                        </Col>
                        <Col className="col-lg-4">
                             
                                {this.state.page==='leaders'?  
                                 <Row>
                                 <Col className="col-lg-12">
                                 <Panel>
                                     <p><b>
                                         ❍ Opinion Leaer (community member)
                                         <br/>
                                         ⤳ Connection between members (Follow)
                                     </b></p>
                                     <p>
                                     Each color represents community
                                     <br/><b>
                                     <span style={{color:'#a0c1f7'}}>Members who were not analyzed yet</span><br/>
                                     <span style={{color:'#FF9900'}}>Members who were not assigned to community</span>
                                     </b></p>
                         
                                 </Panel>
                             </Col>
                         </Row>
                                : 
                                <Row>
                                <Col className="col-lg-12">
                                <Panel>
                                    <p><b>
                                        ❍ Posts - Size: liked
                                        <br/>
                                        ⤳ Writing connection - Size: retweets
                                    </b></p>
                                    <p>
                                    <b>
                                    <span style={{color:'#a0c1f7'}}>Posts who were not analyzed yet</span><br/>
                                    <span style={{color:'#FF9900'}}>Post that does not contain key word</span><br/>
                                    <span style={{color:'#7c5295'}}>Post that contains key word</span> </b></p>
                        
                                </Panel>
                            </Col>
                        </Row>
                                 
                                }

                        {this.state.page==='leaders'?
                          <Row>
                          <Col className="col-lg-12">
                              <Panel headeline="Topics - Community tweets">
                          <div className="col-md-12 profile-text">
                              <Topics/>
                          </div>
                              </Panel>
                          </Col>
                      </Row>
                        :<p></p>}
                               
                          
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