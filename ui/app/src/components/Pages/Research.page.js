import React, { Component } from 'react'
import Content from '../Content'
import Row from '../Row'
import Col from '../Col'
import Panel from '../Panel'
import Header from '../Header'
import Menu from '../Menu'
import Footer from '../Footer'
import ResearchGraph from '../ResearchGraph'
import CommunityPanel from '../Panels'
import {PostsPanel, HealthPanel} from '../Panels'
import * as CONSTS from '../../consts'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


class Research extends Component {
    constructor() {
        super()
        this.state = {
            startDate: new Date(),
            before: '',
            after: ''
          }
        this.showNetwork = this.showNetwork.bind(this)
        this.showCommunities = this.showCommunities.bind(this)
        this.handleSearch = this.handleSearch.bind(this)
    }


    handleSearch(){
        console.log(this.state.startDate)
    }

    showNetwork(){
        if(this.state.before.network)
            return(
                <div>{this.state.before.network.map(topic =>
                    <div>
                        <sapn> -></sapn>
                        {topic.map(item => <sapn> {item} |</sapn>)}
                    </div>
                )}</div>
            )
    }

    showCommunities(){
        if(this.state.before.communities)
            return(
                <div>{this.state.before.communities.map(community => 
                    <span>
                        <h4>community</h4>
                        {community.map(topic =>
                    <div>
                        <sapn> -></sapn>
                        {topic.map(item => <sapn> {item} |</sapn>)}
                    </div>
                )}
                    </span>    
                )}</div>
            )
    }

    handleChange = date => {
        this.setState({
          startDate: date
        });
      };
    componentDidMount() {
        document.title = "Research"

    // const url = 'http://localhost:3002/topics'
    const url = CONSTS.GET_TOPICS

    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
    //   body: formBody
    })
    .then(res => res.json())
    .then(data => this.setState({
        before: data[0],
        after: data[1]
    }))
    .catch(err => console.error(err));
    }

    render() {
        console.log("before", this.state.before)
        console.log("after", this.state.after)
        return(
            <React.Fragment>
                <Header />
                <Menu />
                <Content title="Research" fa="fa-pie-chart">
                <Row>
                        <Col className="col-lg-12">
                            <Panel>
                                <DatePicker
                                    selected={this.state.startDate}
                                    onChange={this.handleChange}
                                    dateFormat="dd/MM/yyyy"
                                    maxDate={new Date()}
                                />
                                <button  style={{marginLeft: "10px"}} className="btn btn-theme03" onClick={this.handleSearch}>Search</button>
                                <div className="btn-group"  style={{marginLeft: "10px"}}>
                                    <button type="button" className="btn btn-theme03">Previous searches</button>
                                    <button type="button" className="btn btn-theme03 dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                        <span className="caret"></span>
                                    </button>
                                    <ul className="dropdown-menu overflow-auto" role="menu">
                                       {/* {this.state.locations.map(this.eachLocation)} */}
                                        <li><a>1</a></li>
                                        <li><a>2</a></li>
                                    </ul>

                                </div>
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-lg-8">
                            <Panel headeline="Graph">
                                <ResearchGraph startDate={this.state.startDate}/>
                            </Panel>
                        </Col>
                        <Col className="col-lg-4">
                            <Panel headeline="Graph explaination">
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-lg-6">
                            <Panel headeline="Network topics">
                             <p> {this.showNetwork()}</p> 
                            </Panel>
                        </Col>
                        <Col className="col-lg-6">
                            <Panel headeline="Communities topics">
                            <p> {this.showCommunities()}</p> 
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                    <Col className="col-lg-4">
                            <Panel headeline="Posts with key words">
                            {/* <CommunityPanel /> */}
                            </Panel>
                        </Col>
                        <Col className="col-lg-4">
                            <Panel headeline="Posts">
                            </Panel>
                        </Col>
                        <Col className="col-lg-4">
                            <Panel headeline="Opinion Leaders">
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-lg-12">
                            <Panel headeline="Toolbar">
                            </Panel>
                        </Col>
                    </Row>
                </Content>
                <Footer />
            </React.Fragment>
        )
    }
}

export default Research;