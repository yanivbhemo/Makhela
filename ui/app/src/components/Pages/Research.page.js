import React, { Component } from 'react'
import Content from '../Content'
import Row from '../Row'
import Col from '../Col'
import Panel from '../Panel'
import Header from '../Header'
import Menu from '../Menu'
import Footer from '../Footer'
import ResearchPosts from '../ResearchPosts'
import ResearchGraph from '../ResearchGraph'
import { LeaderPanel } from '../Panels'
import * as CONSTS from '../../consts'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Cookies from 'js-cookie';
import ModalBox from '../ModalBox'


class Research extends Component {
    constructor() {
        super()
        this.state = {
            startDate: new Date(),
            question: '',
            searchWords : [],
            posts: '',
            disabled: false,
            leader: '',
            leaderData: '',
            searchName: '',
            show: false,
            loading: false,
            prevSearches: [],
            prevSearchesData: []
          }
 
        this.handleSearch = this.handleSearch.bind(this)
        this.fetchPosts = this.fetchPosts.bind(this)
        this.update = this.update.bind(this)
        this.fetchLeader = this.fetchLeader.bind(this)
        this.saveSearch = this.saveSearch.bind(this)
        this.getSearch = this.getSearch.bind(this)
        this.search = this.search.bind(this)
        this.fetchPrevSearches = this.fetchPrevSearches.bind(this)
    }
    fetchPrevSearches(){
        const url = CONSTS.SEARCH_NAME
        fetch(url, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
          body: JSON.stringify({"token":Cookies.get('token')})
      })
            .then(res => res.json())
            .then(data => this.setState({prevSearches: data.names, prevSearchesData: data.data }))

            .catch(err => console.error(err));
    }
    componentDidMount() {
        this.fetchPrevSearches()
      }

    saveSearch(){
        const url = CONSTS.SAVE_SEARCH
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify({
                startDate: this.state.startDate,
                question: this.state.question,
                searchWords: this.state.searchWords,
                disabled: false,
                searchName: this.state.searchName,
                show: false,
                loading: false,
                "token":Cookies.get('token')
            })
            })
            .then(res => res.json())
            .then(data => this.fetchPrevSearches())
            .catch(err => console.error(err));
            this.setState({showModal: false, searchName:''})
    }
    


    fetchLeader(){
        const url = CONSTS.GET_LEADER_BY_ID
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.leader,
                "token":Cookies.get('token')
            })
            })
            .then(res => res.json())
            .then(data => this.setState({leaderData: data}))
            .catch(err => console.error(err));
    }

    update(leader){
        this.setState({leader: leader})
        this.fetchLeader()
    }

    handleChange = date => { this.setState({startDate: date}) }

    getSearch(search){
        const found = this.state.prevSearchesData.find(element => element._id === search)
        if(found.startDate){
            const savedDate = new Date(found.startDate)
            this.setState({startDate: savedDate})
        }
        this.setState({disabled: found.disabled,
                        question: found.question,
                        searchName: found.searchName,
                        searchWords: found.searchWords,
        })
        this.search()
    }

    handleSearch(event){
        event.preventDefault();
        this.search()
    }
  search(){
        if(this.state.question.length>0){
            this.setState({loading: true})
            this.fetchPosts()
        }
    }

    fetchPosts(){
        const url = CONSTS.POST_WORDS

        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                question: this.state.question,
                "token":Cookies.get('token')
            })
            })
            .then(res => res.json())
            .then(data => this.setState({posts: data.found, searchWords:data.words, loading:false}))
            .catch(err => console.error(err));
    }
    

    render() {
        return(
            <React.Fragment>
                <Header />
                <Menu />
                <Content title="Research" fa="fa-pie-chart">
                <ModalBox 
                show={this.state.showModal} 
                title="Saving search"
                onClose={() => this.setState({showModal:false})}
                rightBtnText="Submit"
                onSubmit={() => this.saveSearch()}
                // type="danger"
                >
                    Are you sure?
                </ModalBox>
                    <Col className="col-lg-12 mt">
                            <div className="row content-panel">
                                <div className="btn-group"  style={{marginLeft: "15px"}}>
                                    <button type="button" className="btn btn-theme03">Previous searches</button>
                                    <button type="button" className="btn btn-theme03 dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                        <span className="caret"></span>
                                    </button>
                                    <ul className="dropdown-menu overflow-auto" role="menu">

                                        {this.state.prevSearchesData?this.state.prevSearchesData.map(search => <li><a key={search._id} onClick={() => this.getSearch(search._id)}>{search.searchName}</a></li>): <li><a>1</a></li>}
                                        {/* <li><a>1</a></li>
                                        <li><a>2</a></li> */}
                                    </ul>
                                </div>
                                <div className="panel-heading">
                                    <ul className="nav nav-tabs nav-justified">
                                        <li className="active">
                                            <a data-toggle="tab" href="#question" aria-expanded="true">Research Question</a>
                                        </li>
                                        <li>
                                            <a data-toggle="tab" href="#history" className="contact-map" aria-expanded="false">Network History</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="panel-body">
                                    <div className="tab-content">
                                        <div id="question" className="tab-pane active">
                                            <Row>
                                                <Col className="col-lg-12">
                                                    <Panel>
                                                        <form className="form-inline" role="form">
                                                            <div className="form-group" style={{marginLeft: "10px"}}>
                                                                 <input className="form-control" style={{width: "500px"}} disabled = {(this.state.disabled)? "disabled" : ""} placeholder="Research question" type="text" 
                                                                 onChange={e => this.setState({question: e.target.value})}
                                                                 value={this.state.question}
                                                                />
                                                            </div>
                                                            {this.state.searchWords.length===0 ?
                                                            <button  style={{marginLeft: "10px"}} className="btn btn-theme03" onClick={event => this.handleSearch(event)}>Search</button>
                                                            :
                                                            <button  style={{marginLeft: "10px"}} className="btn btn-theme03" onClick={() => this.setState({question: '', searchWords : [], posts: '', disabled: false})}>New Search</button>
                                                            }
                                                            {this.state.loading===true? <h1>Processing</h1>:<div></div>} 
                                                        </form>
                                                    </Panel>
                                                </Col>
                                            </Row>
                                            {this.state.posts?
                                            <Row>
                                                <Col className="col-lg-8">
                                                    <Panel headeline="Tweets">
                                                    {this.state.loading===true? <div></div>:<ResearchPosts
                                                            words={this.state.searchWords}
                                                            posts={this.state.posts}
                                                            onChange={this.update}
                                                        />}
                                                        
                                                    </Panel>
                                                </Col>
                                                <Col className="col-lg-4">
                                                    <Panel headeline="Influencer">
                                                        <LeaderPanel 
                                                                key={this.state.leaderData.twitter_id}
                                                                index= {this.state.leaderData.twitter_id}
                                                                full_name={this.state.leaderData.full_name}
                                                                twitter_id={this.state.leaderData.twitter_id}
                                                                twitter_profile_image={this.state.leaderData.twitter_profile_image}
                                                                twitter_description={this.state.leaderData.twitter_description}
                                                                twitter_screen_name={this.state.leaderData.twitter_screen_name}
                                                                level_of_certainty={this.state.leaderData.level_of_certainty}
                                                                twitter_followers_count={this.state.leaderData.twitter_followers_count}
                                                                twitter_created_at={this.state.leaderData.twitter_created_at}
                                                                // onBlackListBtn={this.moveToBlackList}
                                                                newUser={true}
                                                        />
                                                    </Panel>
                                                </Col>
                                            </Row>
                                            :
                                            <div></div>
                                            }
                                        </div>
                                        <div id="history" className="tab-pane">
                                            <DatePicker
                                                selected={this.state.startDate}
                                                onChange={this.handleChange}
                                                dateFormat="dd/MM/yyyy"
                                                maxDate={new Date()}
                                            />
                                            <Row>
                                                <Col className="col-lg-8">
                                                    <Panel headeline="Network">
                                                        <ResearchGraph startDate={this.state.startDate}/>
                                                    </Panel>
                                                </Col>
                                                <Col className="col-lg-4">
                                                    <Row>
                                                        <Panel headeline="Symbology">
                                                            <span style={{color:'#7c5295'}}>◯ Members who were added to network BEFORE chosen date</span><br/>
                                                            <span style={{color:'#C5000B'}}>◯ Members who were added to network AFTER chosen date</span><br/>
                                                            <span>Size - Number of tweets</span>
                                                        </Panel>
                                                    </Row>
                                                    <Row>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col className="col-lg-12 mt">
                            <Row>
                                <form className="form-inline" role="form">
                                    <input onChange={e => this.setState({searchName: e.target.value})} className="form-control" style={{width: "500px"}} placeholder="Research Name" type="text"/>
                                    <button  style={{marginLeft: "10px"}} className="btn btn-theme03" onClick={(event) => {event.preventDefault(); this.setState({showModal: true})}}>Save</button>
                                </form>
                            </Row>
                        </Col>
                </Content>
                <Footer />
            </React.Fragment>
        )
    }
}

export default Research;