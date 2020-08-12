import React, { Component } from 'react'
import Content from '../../Content'
import Row from '../../Row'
import Col from '../../Col'
import Panel from '../../Panel'
import Header from '../../Header'
import Menu from '../../Menu'
import Footer from '../../Footer'
import { SuggestionPanel } from '../../Panels'
import * as CONSTS from '../../../consts'
import ModalBox from '../../ModalBox'
import Cookies from 'js-cookie';
import InfiniteScroll from 'react-infinite-scroll-component';

class SuggestionsPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            suggestions: [],
            suggestions_full: [],
            filterdsuggestions: [],
            loadingActive: true,
            showModal: false,
            blackBackground: 'none',
            id_to_blacklist: '',
            amount_of_suggestions: '',
            locations: [],
            filterByName: '',
            filterByScreenName: '',
            start_suggestion_index: 0,
            end_suggestion_index: 20,
            hasMore: true,
            loader_text: 'Loading'
        }
        this.addSuggestions = this.addSuggestions.bind(this)
        this.addAllsuggestions = this.addAllsuggestions.bind(this)
        this.eachSuggestion = this.eachSuggestion.bind(this)
        this.eachLocation = this.eachLocation.bind(this)
        this.moveToBlackList = this.moveToBlackList.bind(this)
        this.addToCommunity = this.addToCommunity.bind(this)
        this.modalOnClose = this.modalOnClose.bind(this)
        this.modalOnSubmit = this.modalOnSubmit.bind(this)
        this.locationOnClick = this.locationOnClick.bind(this)
        this.filterByName = this.filterByName.bind(this)
        this.filterByScreenName = this.filterByScreenName.bind(this)
        this.fetchMoreSuggestions = this.fetchMoreSuggestions.bind(this)
    }

    componentDidMount() {
        document.title = "Suggestions"

        var url = CONSTS.GET_ALL_SUGGESTIONS_LIMITED
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"limitNum": this.state.end_suggestion_index, "token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.length > 0) {
                data.map(suggestion => this.addSuggestions({
                full_name: suggestion.full_name, 
                twitter_id: suggestion.twitter_id, 
                twitter_profile_image: suggestion.twitter_profile_image,
                twitter_description: suggestion.twitter_description,
                twitter_location: suggestion.twitter_location,
                twitter_screen_name: suggestion.twitter_screen_name,
                twitter_created_at: suggestion.twitter_created_at,
                level_of_certainty: suggestion.level_of_certainty,
                twitter_followers_count: suggestion.twitter_followers_count
                }))
            } else {
                this.setState({loader_text: "No Suggestions"})
            }
        })
            .then(res => this.setState({amount_of_suggestions: res.length}))
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
        .then(data => {if(data.length > 0) data.map(location => this.addLocations({
            location
        }))})
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
        .then(data => {
            if(data.length > 0) {
                data.map(leader => this.addAllLeaders({
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
            }
        })
        .catch(err => console.log(err))
        this.setState({loadingActive: false})
    }

    addSuggestions({ event = null, full_name,twitter_id,twitter_profile_image,twitter_description,twitter_location, twitter_screen_name,twitter_created_at,level_of_certainty,twitter_followers_count}) {
        this.setState(prevState => ({
            suggestions: [
                ...prevState.suggestions,
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
            filterdsuggestions: [
                ...prevState.filterdsuggestions,
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

    addAllsuggestions({ event = null, full_name,twitter_id,twitter_profile_image,twitter_description,twitter_location, twitter_screen_name,twitter_created_at,level_of_certainty,twitter_followers_count}) {
        this.setState(prevState => ({
            suggestions_full: [
                ...prevState.suggestions_full,
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
        const url = CONSTS.MOVE_SUGGESTIONS_TO_COMMUNITY
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token'), "twitter_screen_name": twitter_screen_name}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res =>{
            if(res.status === 200){
                this.setState(prevState => ({
                    suggestions: prevState.suggestions.filter(suggestion => suggestion.twitter_screen_name !== twitter_screen_name),
                    amount_of_suggestions: this.state.amount_of_suggestions - 1
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

    eachSuggestion(suggestion, i) {
        var newUser = false
        var create_date=''
        var profile_pic = "img/unknown.jpeg"
        if(suggestion.twitter_created_at){
            create_date = suggestion.twitter_created_at.substring(0,10)
            profile_pic = suggestion.twitter_profile_image
            newUser = true
        }

        return(
            <Col className="col-md-4 mb" key={`Col${i}`} >
                <SuggestionPanel 
                key={`panel${i}`} 
                index={suggestion.twitter_screen_name}
                full_name={suggestion.full_name}
                twitter_id={suggestion.twitter_id}
                twitter_profile_image={profile_pic}
                twitter_description={suggestion.twitter_description}
                twitter_screen_name={suggestion.twitter_screen_name}
                level_of_certainty={suggestion.level_of_certainty}
                twitter_followers_count={suggestion.twitter_followers_count}
                twitter_created_at={create_date}
                onBlackListBtn={this.moveToBlackList}
                onAddBtn={this.addToCommunity}
                newUser={newUser}
                >
                </SuggestionPanel>
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
                    suggestions: prevState.suggestions.filter(suggestion => suggestion.twitter_screen_name !== twitter_screen_name),
                    showModal: false, 
                    blackBackground:'none',
                    amount_of_suggestions: this.state.amount_of_suggestions - 1
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
            body: JSON.stringify({"limitNum": this.state.end_suggestion_index, "token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res  => res.json())
        .then(data => {
            this.setState({suggestions:data, amount_of_suggestions:data.length})
        })
        .catch(err => console.log(err))
    }

    filterByName(e) {
        if(e.target.value.length < this.state.filterByName.length)
            this.setState({filterByName:'',suggestions: this.state.filterdsuggestions})
        else if(e.target.value==="") {
            this.setState({
                filterByName: e.target.value,
                suggestions: this.state.filterdsuggestions,
            })
        } else {
            const {suggestions} = this.state
            this.setState({
                filterByName: e.target.value,
                suggestions: suggestions.filter(item => item.full_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
            })
        }
    }

    filterByScreenName(e) {
        if(e.target.value.length < this.state.filterByScreenName.length)
            this.setState({filterByScreenName:'',suggestions: this.state.filterdsuggestions})
        else if(e.target.value==="") {
            this.setState({
                filterByName: e.target.value,
                suggestions: this.state.filterdsuggestions,
            })
        } else {
            const {suggestions} = this.state
            this.setState({
                filterByScreenName: e.target.value,
                suggestions: suggestions.filter(item => item.twitter_screen_name.toLocaleLowerCase().includes(e.target.value.toLocaleLowerCase()))
            })
        }
    }

    fetchMoreSuggestions() {
        var endIndex = this.state.suggestions.length*2
        var hasMore = true
        if(this.state.suggestions.length * 2 > this.state.suggestions_full.length){
            endIndex = this.state.suggestions.length + (this.state.suggestions_full.length - this.state.suggestions.length)
            hasMore = false
        }
        this.setState({start_suggestion_index: this.state.suggestions.length, end_suggestion_index: endIndex})
        var updatedsuggestions = this.state.suggestions
        var fullsuggestions = this.state.suggestions_full
        for (let i = this.state.start_suggestion_index; i < this.state.end_suggestion_index; i++){
            updatedsuggestions.push(fullsuggestions[i])
        }
        this.setState({suggestions: updatedsuggestions, amount_of_suggestions: updatedsuggestions.length, hasMore: hasMore})
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
                            <h4>Display {this.state.amount_of_suggestions} out of {this.state.suggestions_full.length}</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-lg-12">
                            <InfiniteScroll
                            dataLength={this.state.amount_of_suggestions}
                            next={this.fetchMoreSuggestions}
                            hasMore={this.state.hasMore}
                            loader={<h4>{this.state.loader_text}</h4>}
                            endMessage={
                                <p>No more suggestions</p>
                            }
                            >
                            {this.state.suggestions.map(this.eachSuggestion)}
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

export default SuggestionsPage;