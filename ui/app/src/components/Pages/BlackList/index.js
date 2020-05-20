import React, { Component } from 'react'
import Content from '../../Content'
import Row from '../../Row'
import Col from '../../Col'
import Panel from '../../Panel'
import Header from '../../Header'
import Menu from '../../Menu'
import Footer from '../../Footer'
import { BlackListPanel } from '../../Panels'
import * as CONSTS from '../../../consts'
import ModalBox from '../../ModalBox'
import Cookies from 'js-cookie';
import InfiniteScroll from 'react-infinite-scroll-component';


class BlackListPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            blacklistLeaders: [],
            blacklistLeaders_full: [],
            filterdblacklistLeaders: [],
            loadingActive: true,
            showModal: false,
            blackBackground: 'none',
            id_to_blacklist: '',
            amount_of_blacklistLeaders: '',
            locations: [],
            filterByName: '',
            filterByScreenName: '',
            start_blacklistLeader_index: 0,
            end_blacklistLeader_index: 20,
            hasMore: true
        }
        this.addBlacklistLeaders = this.addBlacklistLeaders.bind(this)
        this.addAllblacklistLeaders = this.addAllblacklistLeaders.bind(this)
        this.eachBlacklistLeader = this.eachBlacklistLeader.bind(this)
        this.eachLocation = this.eachLocation.bind(this)
        this.moveToBlackList = this.moveToBlackList.bind(this)
        this.addToCommunity = this.addToCommunity.bind(this)
        this.locationOnClick = this.locationOnClick.bind(this)
        this.filterByName = this.filterByName.bind(this)
        this.filterByScreenName = this.filterByScreenName.bind(this)
        this.fetchMoreBlacklistLeaders = this.fetchMoreBlacklistLeaders.bind(this)
    }

    componentDidMount() {
        document.title = "Black List"

        var url = CONSTS.GET_ALL_BLACKLISTS_LIMITED
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"limitNum": this.state.end_blacklistLeader_index, "token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => data.map(blacklistLeader => this.addBlacklistLeaders({
            full_name: blacklistLeader.full_name, 
            twitter_id: blacklistLeader.twitter_id, 
            twitter_profile_image: blacklistLeader.twitter_profile_image,
            twitter_description: blacklistLeader.twitter_description,
            twitter_location: blacklistLeader.twitter_location,
            twitter_screen_name: blacklistLeader.twitter_screen_name,
            twitter_created_at: blacklistLeader.twitter_created_at,
            level_of_certainty: blacklistLeader.level_of_certainty,
            twitter_followers_count: blacklistLeader.twitter_followers_count
        })))
        .then(res => this.setState({amount_of_blacklistLeaders: res.length}))
        .catch(err => console.log(err))

        url = CONSTS.GET_ALL_BLACKLISTS_LOCATIONS
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

        var url = CONSTS.GET_ALL_BLACKLISTS
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => data.map(blacklistLeader => this.addAllblacklistLeaders({
            full_name: blacklistLeader.full_name, 
            twitter_id: blacklistLeader.twitter_id, 
            twitter_profile_image: blacklistLeader.twitter_profile_image,
            twitter_description: blacklistLeader.twitter_description,
            twitter_location: blacklistLeader.twitter_location,
            twitter_screen_name: blacklistLeader.twitter_screen_name,
            twitter_created_at: blacklistLeader.twitter_created_at,
            level_of_certainty: blacklistLeader.level_of_certainty,
            twitter_followers_count: blacklistLeader.twitter_followers_count
        })))
        .catch(err => console.log(err))
    }

    addBlacklistLeaders({ event = null, full_name,twitter_id,twitter_profile_image,twitter_description,twitter_location, twitter_screen_name,twitter_created_at,level_of_certainty,twitter_followers_count}) {
        this.setState(prevState => ({
            blacklistLeaders: [
                ...prevState.blacklistLeaders,
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
            filterdblacklistLeaders: [
                ...prevState.filterdblacklistLeaders,
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

    addAllblacklistLeaders({ event = null, full_name,twitter_id,twitter_profile_image,twitter_description,twitter_location, twitter_screen_name,twitter_created_at,level_of_certainty,twitter_followers_count}) {
        this.setState(prevState => ({
            blacklistLeaders_full: [
                ...prevState.blacklistLeaders_full,
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
            loadingActive: false
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

    addToCommunity(twitter_screen_name){
        console.log("Hello")
        const url = CONSTS.MOVE_BLACKLISTS_TO_COMMUNITY + twitter_screen_name
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
                    blacklistLeaders: prevState.blacklistLeaders.filter(blacklistLeader => blacklistLeader.twitter_screen_name !== twitter_screen_name),
                    amount_of_blacklistLeaders: this.state.amount_of_blacklistLeaders - 1
                }))
            }
            else {
                console.log("Error: " + res.status)
            }
        })
        .catch(err => console.log(err))
    }

    eachLocation(location, i){
        return(
            <li key={`Item${i}`}><a key={`Item${i}`} index={location} onClick={this.locationOnClick.bind(this, location)}>{location.name}</a></li>
        )
    }

    eachBlacklistLeader(blacklistLeader, i) {
        var newUser = false
        var create_date=''
        var profile_pic = "img/unknown.jpeg"
        if(blacklistLeader.twitter_created_at){
            create_date = blacklistLeader.twitter_created_at.substring(0,10)
            profile_pic = blacklistLeader.twitter_profile_image
            newUser = true
        }

        return(
            <Col className="col-md-4 mb" key={`Col${i}`} >
                <BlackListPanel 
                key={`panel${i}`} 
                index={blacklistLeader.twitter_screen_name}
                full_name={blacklistLeader.full_name}
                twitter_id={blacklistLeader.twitter_id}
                twitter_profile_image={profile_pic}
                twitter_description={blacklistLeader.twitter_description}
                twitter_screen_name={blacklistLeader.twitter_screen_name}
                level_of_certainty={blacklistLeader.level_of_certainty}
                twitter_followers_count={blacklistLeader.twitter_followers_count}
                twitter_created_at={create_date}
                onBlackListBtn={this.moveToBlackList}
                onAddBtn={this.addToCommunity}
                newUser={newUser}
                >
                </BlackListPanel>
            </Col>
        )
    }

    locationOnClick(location){
        var url = CONSTS.GET_SPECIFIC_LOCATION_SUGGESTIONS+"/"+location.name
        if(!location)
            url = CONSTS.GET_ALL_SUGGESTIONS_LIMITED   
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"limitNum": this.state.end_blacklistLeader_index, "token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res  => res.json())
        .then(data => {
            this.setState({blacklistLeaders:data, amount_of_blacklistLeaders:data.length})
        })
        .catch(err => console.log(err))
    }

    filterByName(e) {
        if(e.target.value.length < this.state.filterByName.length)
            this.setState({filterByName:'',blacklistLeaders: this.state.filterdblacklistLeaders})
        else if(e.target.value==="") {
            this.setState({
                filterByName: e.target.value,
                blacklistLeaders: this.state.filterdblacklistLeaders,
            })
        } else {
            const {blacklistLeaders} = this.state
            this.setState({
                filterByName: e.target.value,
                blacklistLeaders: blacklistLeaders.filter(item => item.full_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
            })
        }
    }

    filterByScreenName(e) {
        if(e.target.value.length < this.state.filterByScreenName.length)
            this.setState({filterByScreenName:'',blacklistLeaders: this.state.filterdblacklistLeaders})
        else if(e.target.value==="") {
            this.setState({
                filterByName: e.target.value,
                blacklistLeaders: this.state.filterdblacklistLeaders,
            })
        } else {
            const {blacklistLeaders} = this.state
            this.setState({
                filterByScreenName: e.target.value,
                blacklistLeaders: blacklistLeaders.filter(item => item.twitter_screen_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
            })
        }
    }

    fetchMoreBlacklistLeaders() {
        var endIndex = this.state.blacklistLeaders.length*2
        var hasMore = true
        if(this.state.blacklistLeaders.length * 2 > this.state.blacklistLeaders_full.length){
            endIndex = this.state.blacklistLeaders.length + (this.state.blacklistLeaders_full.length - this.state.blacklistLeaders.length)
            hasMore = false
        }
        this.setState({start_blacklistLeader_index: this.state.blacklistLeaders.length, end_blacklistLeader_index: endIndex})
        var updatedblacklistLeaders = this.state.blacklistLeaders
        var fullblacklistLeaders = this.state.blacklistLeaders_full
        for (let i = this.state.start_blacklistLeader_index; i < this.state.end_blacklistLeader_index; i++){
            updatedblacklistLeaders.push(fullblacklistLeaders[i])
        }
        this.setState({blacklistLeaders: updatedblacklistLeaders, amount_of_blacklistLeaders: updatedblacklistLeaders.length, hasMore: hasMore})
    }

    render() {
        return(
            <React.Fragment>
                <Header />
                <Menu />
                <Content title="Black List" fa="fa-times" loadingActive={this.state.loadingActive}>
                    <Row>
                        <Col className="col-lg-12">
                            <Panel>
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
                            <h4>Display {this.state.amount_of_blacklistLeaders} out of {this.state.blacklistLeaders_full.length}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <InfiniteScroll
                        dataLength={this.state.amount_of_blacklistLeaders}
                        next={this.fetchMoreBlacklistLeaders}
                        hasMore={this.state.hasMore}
                        loader={<h4>Loading more black list Leader</h4>}
                        endMessage={
                            <p>No more black list Leaders</p>
                        }
                        >
                        {this.state.blacklistLeaders.map(this.eachBlacklistLeader)}
                        </InfiniteScroll>
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

export default BlackListPage;