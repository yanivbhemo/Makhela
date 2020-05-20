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

class GraphPage extends Component {
    // constructor(props) {
    //     super(props)
    // }

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
                        <Col className="col-lg-8">
                            <Panel headeline="Graph">
                                <Network />
                            </Panel>
                        </Col>
                        {/* SWITCH TO COMPONENT */}
                        <Col className="col-lg-4">
                            <Panel headeline="Topics">
                                <div className="col-md-4 profile-text">
                                    <h3>Community Topics</h3>
                                    <h5>community 1</h5>
                                    <p>topic</p>
                                </div>
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
                            <CommunityPanel />
                        </Col>
                        <Col className="col-md-4 col-sm-4 mb">
                            <PostsPanel />
                        </Col>
                        <Col className="col-md-4 col-sm-4 mb">
                            <HealthPanel />
                        </Col>
                    </Row>
                </Content>
                <Footer />
            </React.Fragment>
        )
    }
}

export default GraphPage;