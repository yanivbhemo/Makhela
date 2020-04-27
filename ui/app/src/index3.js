import React from 'react';
import ReactDOM from 'react-dom';
import Header from './components/Header'
import Menu from './components/Menu'
import Content from './components/Content'
import Row from './components/Row'
import Col from './components/Col'
import Panel from './components/Panel'
import Footer from './components/Footer'
import * as serviceWorker from './serviceWorker';

import {community_stats_panel, posts_collected_panel, health_dashboard_panel} from './components/Panels'

ReactDOM.render(
  <React.StrictMode>
    <Header />
    <Menu />
    <Content title="Main Graph" fa="fa-home">
      <Row>
          <Col className="col-lg-12">
            <Panel headeline="Graph">
              <img className="img-fluid img-thumbnail" src="img/network-graph.jpg" alt="Main Graph"/>
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
            {community_stats_panel()}
        </Col>
        <Col className="col-md-4 col-sm-4 mb">
            {posts_collected_panel()}
        </Col>
        <Col className="col-md-4 col-sm-4 mb">
            {health_dashboard_panel()}
        </Col>
      </Row>
    </Content>
    <Footer />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
