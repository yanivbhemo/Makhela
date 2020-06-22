import React, { Component } from 'react'
import ModalBox from '../ModalBox'
import Menu from '../Menu'
import Header from '../Header'
import Footer from '../Footer'
import Content from '../Content'
import Row from '../Row'
import Col from '../Col'
import * as CONSTS from '../../consts'
import * as KEYS from '../../keys'
import InfiniteScroll from 'react-infinite-scroll-component';
import Cookies from 'js-cookie';
import ReactImageFallback from "react-image-fallback";
import Map from '../Map'

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
            twitter_location: '',
            // location_url: '',
            posts:[],
            posts_full: [],
            friends: [],
            friendsGraphLbl: '',
            lat: 0,
            lng: 0,
            amount_of_tweets: 0,
            start_post_index: 0,
            end_post_index: 20,
            hasMore: true
        }
        this.addInformation = this.addInformation.bind(this)
        this.addPosts = this.addPosts.bind(this)
        this.addAllPosts = this.addAllPosts.bind(this)
        this.addFriends = this.addFriends.bind(this)
        this.modalOnClose = this.modalOnClose.bind(this)
        this.modalOnSubmit = this.modalOnSubmit.bind(this)
        this.moveToBlackList = this.moveToBlackList.bind(this)
        this.onlyLastEachPosts = this.onlyLastEachPosts.bind(this)
        this.eachFriend = this.eachFriend.bind(this)
        this.eachPost = this.eachPost.bind(this)
        this.fetchMorePosts = this.fetchMorePosts.bind(this)
    }

    componentDidMount(){
        var prevLocation = this.props.match.path
        if(prevLocation.split("/")[1] === "community")
            this.setState({inCommunity: true})
        else
            this.setState({inCommunity: false})
        let url = CONSTS.GET_SPECIFIC_LEADER+this.state.twitter_screen_name
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => (res.status === 200) ? res.json() : window.location.href = "/community")
            .then(leader => 
                {
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
                        this.setState({amount_of_tweets: posts.length})
                    })
                .catch(err => console.log(err))

                url = CONSTS.GET_ALL_LEADER_POSTS + this.state.information.twitter_id
                fetch(url, {
                    method: 'POST',
                    body: JSON.stringify({"token": Cookies.get('token')}),
                    headers: {
                      'Content-Type': 'application/json'
                    }
                })
                .then(res => res.json())
                    .then(posts => {
                        posts.map(post => this.addAllPosts({
                            post_id: post.post_id,
                            full_text: post.full_text,
                            date_created: post.date_created,
                            internal_create_date: post.internal_create_date
                        }))
                    })
                .catch(err => console.log(err))

                url = CONSTS.GET_LEADER_FRIENDS + this.state.information.twitter_screen_name
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
                                twitter_screen_name: friend[0].twitter_screen_name,
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

    addAllPosts({post_id, full_text, date_created, internal_create_date}) {
        this.setState(prevState => ({
            posts_full: [
                ...prevState.posts_full,
                {
                    post_id: post_id,
                    full_text: full_text,
                    date_created: date_created,
                    internal_create_date: internal_create_date
                }
            ],
        }))
    }

    addFriends({twitter_screen_name, found_date}){
        let url = CONSTS.GET_LEADER_SHORT_DETAILS + twitter_screen_name
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
                const twitter_profile_image = details.twitter_profile_image || ""
                this.setState(prevState => ({
                    friends: [
                        ...prevState.friends,
                        {
                            found_date: found_date,
                            full_name: full_name,
                            twitter_screen_name: twitter_screen_name,
                            twitter_profile_image: twitter_profile_image
                        }
                    ],
                    loadingActive: false,
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
        let city = this.state.information.twitter_location.replace(" ", "%20");
        let url = `${CONSTS.ALT_LNG}key=${KEYS.MAP_GOOGLE_KEY}&location=${city}`
        console.log(city, url)
                fetch(url, {
                    headers: {
                      'Content-Type': 'application/json',
                      'Access-Control-Allow-Origin': '*'
                    }
                })
                .then(res => res.json())
                    .then(data => {
                        console.log("Test")
                        console.log(data.results[0].locations[0].displayLatLng.lat)
                        console.log(data.results[0].locations[0].displayLatLng.lng)
                        this.setState({
                            lat: data.results[0].locations[0].displayLatLng.lat,
                            lng: data.results[0].locations[0].displayLatLng.lng
                        })
                    })
                .catch(err => console.log(err))
        document.title = "Makhela - " + this.state.information.full_name
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
        var pic = friend.twitter_profile_image
        var name = friend.full_name
        var url = "/community/" + friend.twitter_screen_name
        return(
            <li key={`friend${i}`}>
                <a href={url}>
                    <div className="friends-pic">
                            <ReactImageFallback
                              src={pic}
                              fallbackImage="/img/unknown.jpeg"
                              initialImage="loader.gif"
                              alt={name}
                              title={name}
                              className="img-circle"
                              width="35"
                              height="35" />
                    </div>
                </a>
            </li>
        )
    }

    eachPost(post, i) {
        return (
                <div className="panel-body" key={`post${i}`}>
                    <h6><b>Tweet id:</b> {post.post_id}</h6>
                    <h6><b>Date created:</b> {post.date_created}</h6>
                    <strong>{post.full_text}</strong>
                </div>
        )
    }

    fetchMorePosts() {
        var endIndex = this.state.posts.length*2
        var hasMore = true
        if(this.state.posts.length * 2 > this.state.posts_full.length){
            endIndex = this.state.posts.length + (this.state.posts_full.length - this.state.posts.length)
            hasMore = false
        }
        this.setState({start_post_index: this.state.posts.length, end_post_index: endIndex})
        var updatedPosts = this.state.posts
        var fullPosts = this.state.posts_full
        for (let i = this.state.start_post_index; i < this.state.end_post_index; i++){
            updatedPosts.push(fullPosts[i])
        }
        this.setState({posts: updatedPosts, amount_of_tweets: updatedPosts.length, hasMore: hasMore})
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
                                    <h6>TWEETS COUNT</h6>
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
                                        this.state.inCommunity === true ? <button className="btn btn-danger" onClick={this.moveToBlackList}><i className="fa fa-times"></i> Ignore List</button> :
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
                                    <a data-toggle="tab" href="#edit" aria-expanded="false">TWEETS</a>
                                </li>
                                </ul>
                            </div>
                            <div className="panel-body">
                                <div className="tab-content">
                                <div id="overview" className="tab-pane active">
                                    <div className="row">
                                    <div className="col-md-6">
                                        <div className="detailed mt">
                                        <h4>Recent Tweets</h4>
                                        <div className="recent-activity">
                                            { this.state.posts.slice(0,3).map(this.onlyLastEachPosts) }
                                        </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6 detailed">
                                        <h4>Connections within the network</h4>
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
                                    </div>
                                    </div>
                                </div>
                                <div id="contact" className="tab-pane">
                                    <div className="row">
                                    <div className="col-lg-12">
                                        <h4>{this.state.information.twitter_location}</h4>
                                        <div id="map">
                                        <div className="mapouter">
                                            <div className="gmap_canvas">
                                            <Map
                                                lat = {this.state.lat}
                                                lng = {this.state.lng}
                                                isMarkerShown
                                                googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
                                                loadingElement={<div style={{ height: `100%` }} />}
                                                containerElement={<div style={{ height: `400px` }} />}
                                                mapElement={<div style={{ height: `100%` }} />}
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
                                        <h4 className="mb">Influenser's Tweets</h4>
                                        <section className="panel content-panel">
                                        <div className="panel-body">
                                            <h4>Display {this.state.amount_of_tweets} out of {this.state.posts_full.length}</h4>
                                        </div>
                                        </section>
                                        <section className="panel content-panel">
                                            <InfiniteScroll
                                            dataLength={this.state.amount_of_tweets}
                                            next={this.fetchMorePosts}
                                            hasMore={this.state.hasMore}
                                            loader={<h4>Loading more posts</h4>}
                                            endMessage={
                                                <p>No more posts</p>
                                            }
                                            >
                                            {this.state.posts.map(this.eachPost)}
                                            </InfiniteScroll>
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
            </React.Fragment>
        )
    }
}