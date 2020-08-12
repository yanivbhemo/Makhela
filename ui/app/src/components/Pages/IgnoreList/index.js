import React, { Component } from 'react'
import Content from '../../Content'
import Row from '../../Row'
import Col from '../../Col'
import Panel from '../../Panel'
import Header from '../../Header'
import Menu from '../../Menu'
import Footer from '../../Footer'
import { IgnoreListPanel } from '../../Panels'
import * as CONSTS from '../../../consts'
import ModalBox from '../../ModalBox'
import Cookies from 'js-cookie';
import InfiniteScroll from 'react-infinite-scroll-component';


class IgnoreListPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            ignorelistLeaders: [],
            ignorelistLeaders_full: [],
            filterdignorelistLeaders: [],
            loadingActive: true,
            showModal: false,
            blackBackground: 'none',
            id_to_ignorelist: '',
            amount_of_ignorelistLeaders: '',
            locations: [],
            filterByName: '',
            filterByScreenName: '',
            start_ignorelistLeader_index: 0,
            end_ignorelistLeader_index: 20,
            hasMore: true,
            loader_text: 'Loading'
        }
        this.addignorelistLeaders = this.addignorelistLeaders.bind(this)
        this.addAllignorelistLeaders = this.addAllignorelistLeaders.bind(this)
        this.eachignorelistLeader = this.eachignorelistLeader.bind(this)
        this.eachLocation = this.eachLocation.bind(this)
        this.moveToignorelist = this.moveToignorelist.bind(this)
        this.addToCommunity = this.addToCommunity.bind(this)
        this.locationOnClick = this.locationOnClick.bind(this)
        this.filterByName = this.filterByName.bind(this)
        this.filterByScreenName = this.filterByScreenName.bind(this)
        this.fetchMoreignorelistLeaders = this.fetchMoreignorelistLeaders.bind(this)
    }

    componentDidMount() {
        document.title = "Ignore List"

        var url = CONSTS.GET_ALL_BLACKLISTS_LIMITED
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"limitNum": this.state.end_ignorelistLeader_index, "token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.length > 0) {
                data.map(leader => this.addignorelistLeaders({
                    full_name: leader.full_name, 
                    twitter_id: leader.twitter_id, 
                    twitter_profile_image: leader.twitter_profile_image,
                    twitter_description: leader.twitter_description,
                    twitter_location: leader.twitter_location,
                    twitter_screen_name: leader.twitter_screen_name,
                    twitter_created_at: leader.twitter_created_at,
                    level_of_certainty: leader.level_of_certainty,
                    twitter_followers_count: leader.twitter_followers_count
                }))
            } else {
                this.setState({loader_text: "Empty"})
            }
        })
        .then(res => {
            if(res) {
                this.setState({amount_of_ignorelistLeaders: res.length})
            } else {
                this.setState({amount_of_ignorelistLeaders: 0})
            }
        })
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
            .then(data => {if(data.length > 0) data.map(location => this.addLocations({
                location
            }))})
        .catch(err => console.log(err))

        url = CONSTS.GET_ALL_BLACKLISTS
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.length > 0) {
                data.map(ignorelistLeader => this.addAllignorelistLeaders({
                full_name: ignorelistLeader.full_name, 
                twitter_id: ignorelistLeader.twitter_id, 
                twitter_profile_image: ignorelistLeader.twitter_profile_image,
                twitter_description: ignorelistLeader.twitter_description,
                twitter_location: ignorelistLeader.twitter_location,
                twitter_screen_name: ignorelistLeader.twitter_screen_name,
                twitter_created_at: ignorelistLeader.twitter_created_at,
                level_of_certainty: ignorelistLeader.level_of_certainty,
                twitter_followers_count: ignorelistLeader.twitter_followers_count
                }))
            }
        })
        .catch(err => console.log(err))
        this.setState({loadingActive: false})
    }

    addignorelistLeaders({ event = null, full_name,twitter_id,twitter_profile_image,twitter_description,twitter_location, twitter_screen_name,twitter_created_at,level_of_certainty,twitter_followers_count}) {
        this.setState(prevState => ({
            ignorelistLeaders: [
                ...prevState.ignorelistLeaders,
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
            filterdignorelistLeaders: [
                ...prevState.filterdignorelistLeaders,
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

    addAllignorelistLeaders({ event = null, full_name,twitter_id,twitter_profile_image,twitter_description,twitter_location, twitter_screen_name,twitter_created_at,level_of_certainty,twitter_followers_count}) {
        this.setState(prevState => ({
            ignorelistLeaders_full: [
                ...prevState.ignorelistLeaders_full,
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

    moveToignorelist(twitter_screen_name){
        this.setState({showModal: true, blackBackground:'', id_to_ignorelist:twitter_screen_name})
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
                    ignorelistLeaders: prevState.ignorelistLeaders.filter(ignorelistLeader => ignorelistLeader.twitter_screen_name !== twitter_screen_name),
                    amount_of_ignorelistLeaders: this.state.amount_of_ignorelistLeaders - 1
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

    eachignorelistLeader(ignorelistLeader, i) {
        var newUser = false
        var create_date=''
        var profile_pic = "img/unknown.jpeg"
        if(ignorelistLeader.twitter_created_at){
            create_date = ignorelistLeader.twitter_created_at.substring(0,10)
            profile_pic = ignorelistLeader.twitter_profile_image
            newUser = true
        }

        return(
            <Col className="col-md-4 mb" key={`Col${i}`} >
                <IgnoreListPanel 
                key={`panel${i}`} 
                index={ignorelistLeader.twitter_screen_name}
                full_name={ignorelistLeader.full_name}
                twitter_id={ignorelistLeader.twitter_id}
                twitter_profile_image={profile_pic}
                twitter_description={ignorelistLeader.twitter_description}
                twitter_screen_name={ignorelistLeader.twitter_screen_name}
                level_of_certainty={ignorelistLeader.level_of_certainty}
                twitter_followers_count={ignorelistLeader.twitter_followers_count}
                twitter_created_at={create_date}
                onignorelistBtn={this.moveToignorelist}
                onAddBtn={this.addToCommunity}
                newUser={newUser}
                >
                </IgnoreListPanel>
            </Col>
        )
    }

    locationOnClick(location){
        var url = CONSTS.GET_SPECIFIC_LOCATION_SUGGESTIONS+"/"+location.name
        if(!location)
            url = CONSTS.GET_ALL_SUGGESTIONS_LIMITED   
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"limitNum": this.state.end_ignorelistLeader_index, "token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res  => res.json())
        .then(data => {
            this.setState({ignorelistLeaders:data, amount_of_ignorelistLeaders:data.length})
        })
        .catch(err => console.log(err))
    }

    filterByName(e) {
        if(e.target.value.length < this.state.filterByName.length)
            this.setState({filterByName:'',ignorelistLeaders: this.state.filterdignorelistLeaders})
        else if(e.target.value==="") {
            this.setState({
                filterByName: e.target.value,
                ignorelistLeaders: this.state.filterdignorelistLeaders,
            })
        } else {
            const {ignorelistLeaders} = this.state
            this.setState({
                filterByName: e.target.value,
                ignorelistLeaders: ignorelistLeaders.filter(item => item.full_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
            })
        }
    }

    filterByScreenName(e) {
        if(e.target.value.length < this.state.filterByScreenName.length)
            this.setState({filterByScreenName:'',ignorelistLeaders: this.state.filterdignorelistLeaders})
        else if(e.target.value==="") {
            this.setState({
                filterByName: e.target.value,
                ignorelistLeaders: this.state.filterdignorelistLeaders,
            })
        } else {
            const {ignorelistLeaders} = this.state
            this.setState({
                filterByScreenName: e.target.value,
                ignorelistLeaders: ignorelistLeaders.filter(item => item.twitter_screen_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
            })
        }
    }

    fetchMoreignorelistLeaders() {
        var endIndex = this.state.ignorelistLeaders.length*2
        var hasMore = true
        if(this.state.ignorelistLeaders.length * 2 > this.state.ignorelistLeaders_full.length){
            endIndex = this.state.ignorelistLeaders.length + (this.state.ignorelistLeaders_full.length - this.state.ignorelistLeaders.length)
            hasMore = false
        }
        this.setState({start_ignorelistLeader_index: this.state.ignorelistLeaders.length, end_ignorelistLeader_index: endIndex})
        var updatedignorelistLeaders = this.state.ignorelistLeaders
        var fullignorelistLeaders = this.state.ignorelistLeaders_full
        for (let i = this.state.start_ignorelistLeader_index; i < this.state.end_ignorelistLeader_index; i++){
            updatedignorelistLeaders.push(fullignorelistLeaders[i])
        }
        this.setState({ignorelistLeaders: updatedignorelistLeaders, amount_of_ignorelistLeaders: updatedignorelistLeaders.length, hasMore: hasMore})
    }

    render() {
        return(
            <React.Fragment>
                <Header />
                <Menu />
                <Content title="Ignore List" fa="fa-times" loadingActive={this.state.loadingActive}>
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
                            <h4>Display {this.state.amount_of_ignorelistLeaders} out of {this.state.ignorelistLeaders_full.length}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-lg-12">
                            <InfiniteScroll
                            dataLength={this.state.amount_of_ignorelistLeaders}
                            next={this.fetchMoreignorelistLeaders}
                            hasMore={this.state.hasMore}
                            loader={<h4>{this.state.loader_text}</h4>}
                            endMessage={
                                <p>No more ignore list influencers</p>
                            }
                            >
                            {this.state.ignorelistLeaders.map(this.eachignorelistLeader)}
                            </InfiniteScroll>
                        </Col>
                    </Row>
                </Content>
                <ModalBox 
                show={this.state.showModal} 
                title="Are you sure?"
                onClose={this.modalOnClose}
                rightBtnText="Ignore List"
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

export default IgnoreListPage;