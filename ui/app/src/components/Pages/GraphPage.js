import React, { Component } from 'react'
import Content from '../Content'
import Row from '../Row'
import Col from '../Col'
import Panel from '../Panel'
import Header from '../Header'
import Menu from '../Menu'
import Footer from '../Footer'
import Community_stats_panel from '../Panels'
import {Posts_collected_panel, Health_dashboard_panel} from '../Panels'

class GraphPage extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        document.title = "Main Graph"
    }

    render() {
        return(
            <React.Fragment>
                <Header />
                <Menu />
                <Content title="Main Graph" fa="fa-home">
                    <Row>
                        <Col className="col-lg-12">
                            <Panel headeline="Graph">
                                <img className="img-fluid img-thumbnail" src="img/network-graph.jpg" alt="Main Graph" />
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-lg-12">
                            <Panel headeline="Toolbar">
                                Test
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-md-4 col-sm-4 mb">
                            <Community_stats_panel />
                        </Col>
                        <Col className="col-md-4 col-sm-4 mb">
                            <Posts_collected_panel />
                        </Col>
                        <Col className="col-md-4 col-sm-4 mb">
                            <Health_dashboard_panel />
                        </Col>
                    </Row>
                </Content>
                <Footer />
            </React.Fragment>
        )
    }
}

export default GraphPage;