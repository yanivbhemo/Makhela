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
import Network from '../Network'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


class Research extends Component {
    constructor() {
        super()
        this.state = {
            startDate: new Date()
          }
    }


    handleChange = date => {
        this.setState({
          startDate: date
        });
      };
    componentDidMount() {
        document.title = "Main Graph"
    }

    render() {
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
                            <button className="btn btn-theme03">Search</button>
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
                            </Panel>
                        </Col>
                        <Col className="col-lg-6">
                            <Panel headeline="Communities topics">
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                    <Col className="col-lg-4">
                            <Panel headeline="Posts with key words">
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