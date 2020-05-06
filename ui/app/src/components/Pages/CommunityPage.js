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
import ModalBox from '../ModalBox'
import { NavLink } from 'react-router-dom';

const filter_button_style = {
    paddingRight: "10px"
};


class CommunityPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            leaders: [],
            loadingActive: true,
            showModal: false,
            blackBackground: 'none',
            id_to_blacklist: '',
            amount_of_leaders: '',
            locations: [],
        }
        
        this.addLeaders = this.addLeaders.bind(this)
        this.eachLeader = this.eachLeader.bind(this)
        this.eachLocation = this.eachLocation.bind(this)
        this.moveToBlackList = this.moveToBlackList.bind(this)
        this.modalOnClose = this.modalOnClose.bind(this)
        this.modalOnSubmit = this.modalOnSubmit.bind(this)
        this.locationOnClick = this.locationOnClick.bind(this)
    }

    componentDidMount() {
        document.title = "Community"

        var url = CONSTS.GET_ALL_LEADERS
        fetch(url)
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
        .then(res => this.setState({amount_of_leaders: res.length}))
        .catch(err => console.log(err))

        url = CONSTS.GET_ALL_LEADERS_LOCATIONS
        fetch(url)
        .then(res => res.json())
        .then(data => data.map(location => this.addLocations({
            location
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

    moveToBlackList(twitter_id){
        this.setState({showModal: true, blackBackground:'', id_to_blacklist:twitter_id})
    }

    eachLocation(location, i){
<<<<<<< HEAD
=======
        // console.log(location)
>>>>>>> 96ab1366edc726d1cfc0d41f88dd6db82d995251
        return(
            <li key={`Item${i}`}><a key={`Item${i}`} index={location} onClick={this.locationOnClick.bind(this, location)}>{location.name}</a></li>
        )
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

    modalOnClose() {
        this.setState({showModal: false, blackBackground:'none'})
    }

    modalOnSubmit(){
        const twitter_id = this.state.id_to_blacklist
        const url = CONSTS.MOVE_LEADER_TO_BLACKLIST+"/"+twitter_id
        fetch(url)
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

    locationOnClick(location){
        if(!location)
            var url = CONSTS.GET_ALL_LEADERS   
        else var url = CONSTS.GET_SPECIFIC_LOCATION_LEADERS+"/"+location.name
        fetch(url)
        .then(res  => res.json())
        .then(data => {
            this.setState({leaders:data, amount_of_leaders:data.length})
        })
        .catch(err => console.log(err))
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
                                <NavLink exact to="/addLeader">
                                    <button type="button" className="btn btn-success">Add a leader</button>
                                </NavLink>
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-lg-12">
                            <Panel>
                                <strong style={filter_button_style}>Filters: </strong>
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
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-lg-12">
                            <h4>Amount of leaders: {this.state.amount_of_leaders}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <div className="leadersList">
<<<<<<< HEAD
                            {this.state.leaders.map(this.eachLeader)}
=======
                            {
                                this.state.leaders.map(this.eachLeader)
                            }
>>>>>>> 96ab1366edc726d1cfc0d41f88dd6db82d995251
                        </div>
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

export default CommunityPage;