import React, { Component } from 'react'
import ModalBox from '../ModalBox'
import Menu from '../Menu'
import Header from '../Header'
import Footer from '../Footer'
import Content from '../Content'
import Row from '../Row'
import Col from '../Col'
import * as CONSTS from '../../consts'
import Iframe from 'react-iframe'
import Cookies from 'js-cookie';
import { Redirect } from 'react-router-dom';


export default class ProfilePage extends Component {
    constructor(props){
        super(props)
        this.state = {
            loadingActive: true,
            twitter_screen_name: this.props.match.params.twitter_screen_name,
            information: '',
            inCommunity: '',
            showModal: false,
            blackBackground: 'none',
            location_url: '',
            posts:[],
            friends: [],
            friendsGraphLbl: ''
        }
        this.addInformation = this.addInformation.bind(this)
        this.addPosts = this.addPosts.bind(this)
        this.addFriends = this.addFriends.bind(this)
        this.modalOnClose = this.modalOnClose.bind(this)
        this.modalOnSubmit = this.modalOnSubmit.bind(this)
        this.moveToBlackList = this.moveToBlackList.bind(this)
        this.onlyLastEachPosts = this.onlyLastEachPosts.bind(this)
        this.eachFriend = this.eachFriend.bind(this)
    }

    componentDidMount(){
        var prevLocation = this.props.match.path
        if(prevLocation.split("/")[1] === "community")
            this.setState({inCommunity: true})
        else
            this.setState({inCommunity: false})
        var url = CONSTS.GET_SPECIFIC_LEADER+this.state.twitter_screen_name
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => (res.status === 200) ? res.json() : window.location.href = "/community")
            .then(leader => {
                this.addInformation({
                full_name: leader.full_name, 
                twitter_id: leader.twitter_id, 
                twitter_profile_image: leader.twitter_profile_image,
                twitter_description: leader.twitter_description,
                twitter_location: leader.twitter_location,
                twitter_screen_name: leader.twitter_screen_name,
                twitter_created_at: leader.twitter_created_at,
                level_of_certainty: leader.level_of_certainty,
                twitter_followers_count: leader.twitter_followers_count,
                twitter_friends_count: leader.twitter_friends_count,
                twitter_statuses_count: leader.twitter_statuses_count,
                })
                
                url = CONSTS.GET_LEADER_POSTS + this.state.information.twitter_id
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({"token":Cookies.get('token')}),
                    headers: {
                      'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                    .then(posts => {
                        posts.map(post => this.addPosts({
                            post_id: post.post_id,
                            full_text: post.full_text,
                            date_created: post.date_created,
                            internal_create_date: post.internal_create_date
                        }))
                    })
                .catch(err => console.log(err))
        
                url = CONSTS.GET_LEADER_FRIENDS + this.state.information.twitter_id
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({"token":Cookies.get('token')}),
                    headers: {
                      'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                    .then(friends => {
                        if(friends.community_following.length > 0 ){
                            friends.community_following.map(friend => this.addFriends({
                                twitter_id: friend[0].twitter_id,
                                found_date: friend[0].found_date
                            }))
                        } else {
                            this.setState({friendsGraphLbl:'', loadingActive: false})
                        }
                    })
                .catch(err => console.log(err))
                }
            )
        .catch(err => console.log(err))
    }

    addFriends({twitter_id, found_date}){
        let url = CONSTS.GET_LEADER_SHORT_DETAILS + twitter_id
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
            .then(details => {
                const full_name = details.full_name || ""
                const twitter_screen_name = details.twitter_screen_name || ""
                const twitter_profile_image = details.twitter_profile_image || ""
                this.setState(prevState => ({
                    friends: [
                        ...prevState.friends,
                        {
                            twitter_id: twitter_id,
                            found_date: found_date,
                            full_name: full_name,
                            twitter_screen_name: twitter_screen_name,
                            twitter_profile_image: twitter_profile_image
                        }
                    ],
                    loadingActive: false,
                    friendsGraphLbl: 'VIEW AS GRAPH'
                }))
            })
            .catch(err => {console.log(err)})
    }

    addPosts({post_id, full_text, date_created, internal_create_date})
    {
        this.setState(prevState => ({
            posts: [
                ...prevState.posts,
                {
                    post_id: post_id,
                    full_text: full_text,
                    date_created: date_created,
                    internal_create_date: internal_create_date
                }
            ],
        }))
    }

    addInformation({
        full_name,
        twitter_id,
        twitter_profile_image,
        twitter_description,
        twitter_location,
        twitter_screen_name,
        twitter_created_at,
        level_of_certainty,
        twitter_followers_count,
        twitter_friends_count,
        twitter_statuses_count,
    }) {
        this.setState(prevState => ({
            information:
                {
                    full_name: full_name, 
                    twitter_id: twitter_id, 
                    twitter_profile_image: twitter_profile_image,
                    twitter_description: twitter_description,
                    twitter_location: twitter_location,
                    twitter_screen_name: twitter_screen_name,
                    twitter_created_at: twitter_created_at,
                    level_of_certainty: level_of_certainty,
                    twitter_followers_count: twitter_followers_count,
                    twitter_friends_count: twitter_friends_count,
                    twitter_statuses_count: twitter_statuses_count,
                },
        }))
        var string = encodeURIComponent(this.state.information.twitter_location)
        var location = `https://maps.google.com/maps?q=${string}&amp;t=k&amp;z=5&amp;ie=UTF8&amp;iwloc=&amp;output=embed`
        this.setState({location_url: location})
    }

    moveToBlackList(twitter_id){
        this.setState({showModal: true, blackBackground:''})
    }

    modalOnClose() {
        this.setState({showModal: false, blackBackground:'none'})
    }

    modalOnSubmit(){
        const twitter_id = this.state.twitter_id
        const url = CONSTS.MOVE_LEADER_TO_BLACKLIST+"/"+twitter_id
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res =>{
            if(res.status === 200){
                this.setState(prevState => ({
                    leaders: prevState.leaders.filter(leader => leader.twitter_id !== twitter_id),
                    showModal: false, 
                    blackBackground:'none',
                    amount_of_leaders: this.state.amount_of_leaders - 1
                }))
            }
            else {
                console.log("Error: " + res.status)
            }
        })
        .catch(err => console.log(err))
    }

    onlyLastEachPosts(post, i) {
        return(
            <div className="activity-panel" key={`post${i}`}>
                <h5>{post.date_created}</h5>
                <p>{post.full_text}</p>
            </div>
        )
    }

    eachFriend(friend, i) {
        var pic = "/img/unknown.jpeg"
        var name = friend.twitter_id
        var url = ""
        if(friend.twitter_profile_image !== "none")
            pic = friend.twitter_profile_image
            name = friend.full_name
            url = "/community/" + friend.twitter_screen_name
        return(
            <li key={`friend${i}`}>
                <a href={url}><div className="friends-pic"><img className="img-circle" width="35" height="35" src={pic} alt={name} title={name} /></div></a>
            </li>
        )
    }

    render() {
        return(
            <React.Fragment>
                <Header />
                <Menu />
                <Content title="" fa="" loadingActive={this.state.loadingActive}>
                    <Row id="profile-page-row">
                        <Col className="col-lg-12">
                            <div className="row content-panel">
                            <div className="col-md-4 profile-text mt mb centered">
                                <div className="right-divider hidden-sm hidden-xs">
                                <div className="row">
                                    <div className="col-md-6">
                                    <h5>{this.state.information.twitter_followers_count}</h5>
                                    <h6>FOLLOWERS</h6>
                                    <h5>{this.state.information.twitter_friends_count}</h5>
                                    <h6>FOLLOWING</h6>
                                    <h5>{this.state.information.level_of_certainty}</h5>
                                    <h6>CERTAINTY</h6>
                                    </div>
                                    <div className="col-md-6">
                                    <h5><a href={`https://twitter.com/${this.state.information.twitter_screen_name}`}>{this.state.information.twitter_screen_name}</a></h5>
                                    <h6>TWITTER NAME</h6>
                                    <h5>{this.state.information.twitter_created_at}</h5>
                                    <h6>DATE OF CREATION</h6>
                                    <h5>{this.state.information.twitter_statuses_count}</h5>
                                    <h6>STATUS COUNT</h6>
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="col-md-4 profile-text">
                                <h3>{this.state.information.full_name}</h3>
                                <p>{this.state.information.twitter_description}</p>
                            </div>
                            <div className="col-md-4 centered">
                                <div className="profile-pic">
                                <p><img src={this.state.information.twitter_profile_image} className="img-circle" alt="profile" /></p>
                                <p>
                                    {
                                        this.state.inCommunity === true ? <button className="btn btn-danger" onClick={this.moveToBlackList}><i className="fa fa-times"></i> Blacklist</button> :
                                        <button className="btn btn-success"><i className="fa fa-check"></i> Add to community</button>
                                    }
                                </p>
                                </div>
                            </div>
                            </div>
                        </Col>
                        <Col className="col-lg-12 mt">
                            <div className="row content-panel">
                            <div className="panel-heading">
                                <ul className="nav nav-tabs nav-justified">
                                <li className="active">
                                    <a data-toggle="tab" href="#overview" aria-expanded="true">Overview</a>
                                </li>
                                <li>
                                    <a data-toggle="tab" href="#contact" className="contact-map" aria-expanded="false">Location</a>
                                </li>
                                <li>
                                    <a data-toggle="tab" href="#edit" aria-expanded="false">POSTS</a>
                                </li>
                                </ul>
                            </div>
                            <div className="panel-body">
                                <div className="tab-content">
                                <div id="overview" className="tab-pane active">
                                    <div className="row">
                                    <div className="col-md-6">
                                        <div className="detailed mt">
                                        <h4>Recent Posts</h4>
                                        <div className="recent-activity">
                                            { this.state.posts.slice(0,3).map(this.onlyLastEachPosts) }
                                        </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 detailed">
                                        <h4>Connections within the community</h4>
                                        <div className="row centered mb">
                                        <ul className="my-friends">
                                            { this.state.friends.map(this.eachFriend)}
                                        </ul>
                                        <div className="row mt">
                                            <div className="col-md-4 col-md-offset-4">
                                            <h6><a href="#">{this.state.friendsGraphLbl}</a></h6>
                                            </div>
                                        </div>
                                        </div>
                                        <h4>TRENDS ANALYSIS</h4>
                                        <div className="row centered">
                                        <div className="col-md-8 col-md-offset-2">
                                            <h5>Dashboard Update (40%)</h5>
                                            <div className="progress">
                                            <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width: "40%"}}>
                                                <span className="sr-only">40% Complete (success)</span>
                                            </div>
                                            </div>
                                            <h5>Unanswered Messages (80%)</h5>
                                            <div className="progress">
                                            <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width: "80%"}}>
                                                <span className="sr-only">80% Complete (success)</span>
                                            </div>
                                            </div>
                                            <h5>Product Review (60%)</h5>
                                            <div className="progress">
                                            <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width: "60%"}}>
                                                <span className="sr-only">60% Complete (success)</span>
                                            </div>
                                            </div>
                                            <h5>Friend Requests (90%)</h5>
                                            <div className="progress">
                                            <div className="progress-bar progress-bar-info" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style={{width: "90%"}}>
                                                <span className="sr-only">90% Complete (success)</span>
                                            </div>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div id="contact" className="tab-pane">
                                    <div className="row">
                                    <div className="col-lg-12">
                                        <h4>Washington, DC</h4>
                                        <div id="map">
                                        <div className="mapouter">
                                            <div className="gmap_canvas">
                                            <Iframe
                                            url={this.state.location_url || ''}
                                            width="1080px"
                                            height="500px"
                                            id="gmap_canvas"
                                            />
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                <div id="edit" className="tab-pane">
                                    <div className="row">
                                    <div className="col-lg-8 col-lg-offset-2 detailed">
                                        <h4 className="mb">Leader's Posts</h4>
                                        <section className="panel content-panel">
                                        <div className="panel-body">
                                            <strong className="">Filters: </strong>
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
                                        </div>
                                        </section>
                                        <section className="panel content-panel">
                                        <div className="panel-body">
                                            <h6><b>Post id:</b> 123456</h6>
                                            <h6><b>Date created:</b> 2020-03-06T15:12:24.000+00:00</h6>
                                            <h6><b>Reply to text:</b> @dassakaye Exactly. Never has made it more clear in the U.S. that good governance is a matter of life and death.</h6>
                                            <strong>@michaeltanchum Yep, this applies globally. The need for truth, data and transparency as well.</strong>
                                        </div>
                                        </section>
                                    </div>
                                    </div>
                                </div>
                                </div>
                            </div>
                            </div>
                        </Col>
                    </Row>
                </Content>
                <ModalBox 
                show={this.state.showModal} 
                title="Are you sure?"
                onClose={this.modalOnClose}
                rightBtnText="Blacklist"
                onSubmit={this.modalOnSubmit}
                type="danger"
                >
                </ModalBox>
                <Footer />
            </React.Fragment>
        )
    }
}