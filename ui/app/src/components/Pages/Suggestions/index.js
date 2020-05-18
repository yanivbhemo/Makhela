import React, { Component } from 'react'
import Content from '../../Content'
import Row from '../../Row'
import Col from '../../Col'
import Panel from '../../Panel'
import Header from '../../Header'
import Menu from '../../Menu'
import Footer from '../../Footer'
import { LeaderPanel } from '../../Panels'
import * as CONSTS from '../../../consts'
import ModalBox from '../../ModalBox'
import { NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import InfiniteScroll from 'react-infinite-scroll-component';


const filter_button_style = {
    paddingRight: "10px"
};


class SuggestionsPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leaders: [],
            leaders_full: [],
            filterdLeaders: [],
            loadingActive: true,
            showModal: false,
            blackBackground: 'none',
            id_to_blacklist: '',
            amount_of_leaders: '',
            locations: [],
            filterByName: '',
            filterByScreenName: '',
            start_leader_index: 0,
            end_leader_index: 20,
            hasMore: true
        }
        this.addLeaders = this.addLeaders.bind(this)
        this.addAllLeaders = this.addAllLeaders.bind(this)
        this.eachLeader = this.eachLeader.bind(this)
        this.eachLocation = this.eachLocation.bind(this)
        this.moveToBlackList = this.moveToBlackList.bind(this)
        this.modalOnClose = this.modalOnClose.bind(this)
        this.modalOnSubmit = this.modalOnSubmit.bind(this)
        this.locationOnClick = this.locationOnClick.bind(this)
        this.filterByName = this.filterByName.bind(this)
        this.filterByScreenName = this.filterByScreenName.bind(this)
        this.fetchMoreLeaders = this.fetchMoreLeaders.bind(this)
    }

    componentDidMount() {
        document.title = "Suggestions"

        var url = CONSTS.GET_ALL_SUGGESTIONS_LIMITED
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"limitNum": this.state.end_leader_index, "token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => data.map(leader => this.addLeaders({
            full_name: leader.full_name, 
            twitter_id: leader.twitter_id, 
            twitter_profile_image: leader.twitter_profile_image,
            twitter_description: leader.twitter_description,
            twitter_location: leader.twitter_location,
            twitter_screen_name: leader.twitter_screen_name,
            twitter_created_at: leader.twitter_created_at,
            level_of_certainty: leader.level_of_certainty,
            twitter_followers_count: leader.twitter_followers_count
        })))
        .then(res => this.setState({loadingActive: false, amount_of_leaders: res.length}))
        .catch(err => console.log(err))

        url = CONSTS.GET_ALL_SUGGESTIONS_LOCATIONS
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res => res.json())
        .then(data => data.map(location => this.addLocations({
            location
        })))
        .catch(err => console.log(err))

        var url = CONSTS.GET_ALL_SUGGESTIONS
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => data.map(leader => this.addAllLeaders({
            full_name: leader.full_name, 
            twitter_id: leader.twitter_id, 
            twitter_profile_image: leader.twitter_profile_image,
            twitter_description: leader.twitter_description,
            twitter_location: leader.twitter_location,
            twitter_screen_name: leader.twitter_screen_name,
            twitter_created_at: leader.twitter_created_at,
            level_of_certainty: leader.level_of_certainty,
            twitter_followers_count: leader.twitter_followers_count
        })))
        .catch(err => console.log(err))
    }

    addLeaders({ event = null, full_name,twitter_id,twitter_profile_image,twitter_description,twitter_location, twitter_screen_name,twitter_created_at,level_of_certainty,twitter_followers_count}) {
        this.setState(prevState => ({
            leaders: [
                ...prevState.leaders,
                {
                    full_name: full_name, 
                    twitter_id: twitter_id, 
                    twitter_profile_image: twitter_profile_image,
                    twitter_description: twitter_description,
                    twitter_location: twitter_location,
                    twitter_screen_name: twitter_screen_name,
                    twitter_created_at: twitter_created_at,
                    level_of_certainty: level_of_certainty,
                    twitter_followers_count: twitter_followers_count
                }
            ],
            filterdLeaders: [
                ...prevState.filterdLeaders,
                {
                    full_name: full_name, 
                    twitter_id: twitter_id, 
                    twitter_profile_image: twitter_profile_image,
                    twitter_description: twitter_description,
                    twitter_location: twitter_location,
                    twitter_screen_name: twitter_screen_name,
                    twitter_created_at: twitter_created_at,
                    level_of_certainty: level_of_certainty,
                    twitter_followers_count: twitter_followers_count
                }
            ],
            
        }))
    }

    addAllLeaders({ event = null, full_name,twitter_id,twitter_profile_image,twitter_description,twitter_location, twitter_screen_name,twitter_created_at,level_of_certainty,twitter_followers_count}) {
        this.setState(prevState => ({
            leaders_full: [
                ...prevState.leaders_full,
                {
                    full_name: full_name, 
                    twitter_id: twitter_id, 
                    twitter_profile_image: twitter_profile_image,
                    twitter_description: twitter_description,
                    twitter_location: twitter_location,
                    twitter_screen_name: twitter_screen_name,
                    twitter_created_at: twitter_created_at,
                    level_of_certainty: level_of_certainty,
                    twitter_followers_count: twitter_followers_count
                }
            ]
        }))
    }

    addLocations({location}){
        this.setState(prevState => ({
            locations: [
                ...prevState.locations,
                {
                    name: location
                }
            ]
        }))
    }

    moveToBlackList(twitter_screen_name){
        this.setState({showModal: true, blackBackground:'', id_to_blacklist:twitter_screen_name})
    }

    eachLocation(location, i){
        return(
            <li key={`Item${i}`}><a key={`Item${i}`} index={location} onClick={this.locationOnClick.bind(this, location)}>{location.name}</a></li>
        )
    }

    eachLeader(leader, i) {
        var newUser = false
        var create_date=''
        var profile_pic = "img/unknown.jpeg"
        if(leader.twitter_created_at){
            create_date = leader.twitter_created_at.substring(0,10)
            profile_pic = leader.twitter_profile_image
            newUser = true
        }

        return(
            <Col className="col-md-4 mb" key={`Col${i}`} >
                <LeaderPanel 
                key={`panel${i}`} 
                index={leader.twitter_screen_name}
                full_name={leader.full_name}
                twitter_id={leader.twitter_id}
                twitter_profile_image={profile_pic}
                twitter_description={leader.twitter_description}
                twitter_screen_name={leader.twitter_screen_name}
                level_of_certainty={leader.level_of_certainty}
                twitter_followers_count={leader.twitter_followers_count}
                twitter_created_at={create_date}
                onBlackListBtn={this.moveToBlackList}
                newUser={newUser}
                >
                </LeaderPanel>
            </Col>
        )
    }

    modalOnClose() {
        this.setState({showModal: false, blackBackground:'none'})
    }

    modalOnSubmit(){
        const twitter_screen_name = this.state.id_to_blacklist
        const url = CONSTS.MOVE_SUGGESTIONS_TO_BLACKLIST+"/"+twitter_screen_name
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
                    leaders: prevState.leaders.filter(leader => leader.twitter_screen_name !== twitter_screen_name),
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

    locationOnClick(location){
        var url = CONSTS.GET_SPECIFIC_LOCATION_SUGGESTIONS+"/"+location.name
        if(!location)
            url = CONSTS.GET_ALL_SUGGESTIONS_LIMITED   
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"limitNum": this.state.end_leader_index, "token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res  => res.json())
        .then(data => {
            this.setState({leaders:data, amount_of_leaders:data.length})
        })
        .catch(err => console.log(err))
    }

    filterByName(e) {
        if(e.target.value.length < this.state.filterByName.length)
            this.setState({filterByName:'',leaders: this.state.filterdLeaders})
        else if(e.target.value==="") {
            this.setState({
                filterByName: e.target.value,
                leaders: this.state.filterdLeaders,
            })
        } else {
            const {leaders} = this.state
            this.setState({
                filterByName: e.target.value,
                leaders: leaders.filter(item => item.full_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
            })
        }
    }

    filterByScreenName(e) {
        if(e.target.value.length < this.state.filterByScreenName.length)
            this.setState({filterByScreenName:'',leaders: this.state.filterdLeaders})
        else if(e.target.value==="") {
            this.setState({
                filterByName: e.target.value,
                leaders: this.state.filterdLeaders,
            })
        } else {
            const {leaders} = this.state
            this.setState({
                filterByScreenName: e.target.value,
                leaders: leaders.filter(item => item.twitter_screen_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
            })
        }
    }

    fetchMoreLeaders() {
        var endIndex = this.state.leaders.length*2
        var hasMore = true
        if(this.state.leaders.length * 2 > this.state.leaders_full.length){
            endIndex = this.state.leaders.length + (this.state.leaders_full.length - this.state.leaders.length)
            hasMore = false
        }
        this.setState({start_leader_index: this.state.leaders.length, end_leader_index: endIndex})
        var updatedLeaders = this.state.leaders
        var fullLeaders = this.state.leaders_full
        for (let i = this.state.start_leader_index; i < this.state.end_leader_index; i++){
            updatedLeaders.push(fullLeaders[i])
        }
        this.setState({leaders: updatedLeaders, amount_of_leaders: updatedLeaders.length, hasMore: hasMore})
    }

    render() {
        return(
            <React.Fragment>
                <Header />
                <Menu />
                <Content title="Suggestions" fa="fa-plus" loadingActive={this.state.loadingActive}>
                    <Row>
                        <Col className="col-lg-12">
                            <Panel>
                                {/* <strong style={filter_button_style}>Filters: </strong> */}
                                {/* <div className="form-panel"> */}
                                    <h4 className="mb"><i className="fa fa-angle-right"></i> Filters</h4>
                                    <form className="form-inline" role="form">
                                        <div className="form-group">
                                            <div className="btn-group">
                                                <button type="button" className="btn btn-theme03">Locations</button>
                                                <button type="button" className="btn btn-theme03 dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                                    <span className="caret"></span>
                                                    <span className="sr-only">Toggle Dropdown</span>
                                                    </button>
                                                <ul className="dropdown-menu overflow-auto" role="menu">
                                                    {/* {this.state.locations.map(this.eachLocation)} */}
                                                    <li><a onClick={this.locationOnClick.bind(this, '')}>All</a></li>
                                                    {this.state.locations.map(this.eachLocation)} 
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="form-group" style={{marginLeft: "10px"}}>
                                            <input className="form-control" style={{width: "100%"}} placeholder="By Name" type="text" value={this.state.filterByName} onChange={this.filterByName} />
                                        </div>
                                        <div className="form-group" style={{marginLeft: "10px"}}>
                                            <input className="form-control" style={{width: "100%"}} placeholder="By Twitter Name" type="text" value={this.state.filterByScreenName} onChange={this.filterByScreenName} />
                                        </div>
                                    </form>
                                {/* </div> */}
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-lg-12">
                            <h4>Amount of leaders: {this.state.amount_of_leaders}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <InfiniteScroll
                        dataLength={this.state.amount_of_leaders}
                        next={this.fetchMoreLeaders}
                        hasMore={this.state.hasMore}
                        loader={<h4>Loading more leaders</h4>}
                        endMessage={
                            <p>No more leaders</p>
                        }
                        >
                        {this.state.leaders.map(this.eachLeader)}
                        </InfiniteScroll>
                        {/* <div className="leadersList">
                            {this.state.leaders.map(this.eachLeader)}
                        </div> */}
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
                <div className="modal-backdrop fade in" style={{display: this.state.blackBackground}}></div>
            </React.Fragment>
        )
    }
}

export default SuggestionsPage;