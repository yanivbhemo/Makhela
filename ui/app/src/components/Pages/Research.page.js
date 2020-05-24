import React, { Component } from 'react'
import Content from '../Content'
import Row from '../Row'
import Col from '../Col'
import Panel from '../Panel'
import Header from '../Header'
import Menu from '../Menu'
import Footer from '../Footer'
import CommunityPanel from '../Panels'
import {PostsPanel, HealthPanel} from '../Panels'
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
    }


    handleChange = date => {
        this.setState({
          startDate: date
        });
      };
    componentDidMount() {
        document.title = "Research"

    const url = 'http://localhost:3002/topics'

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
                                <button  style={{marginLeft: "10px"}} className="btn btn-theme03">Search</button>
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
                             <p> {this.state.before.network}</p> 
                            </Panel>
                        </Col>
                        <Col className="col-lg-6">
                            <Panel headeline="Communities topics">
                            <p> {this.state.before.communities}</p> 
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