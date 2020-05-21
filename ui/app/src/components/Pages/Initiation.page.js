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
import * as CONSTS from '../../consts'
import Cookies from 'js-cookie';



class Initiation extends Component {
    constructor() {
        super()
        this.state = {
            leaders: '',
            keyWords: ''
          }
    }

    componentDidMount() {
        document.title = "Initiation"
    }

    handleClick = () => {
        console.log("click")
        let url = CONSTS.INIT_SYSTEM
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                "token":Cookies.get('token'),
                "keyWords": this.state.keyWords,
                "leaders": this.state.leaders
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res => res.json())
        .then(data => console.log(data))
        .catch(err => console.log(err))
        this.setState({
            leaders: '',
            keyWords: ''
        })
    }
    handleChange = e => {
        if(e.target.id === "leaders")
            this.setState({leaders: e.target.value})
        else if(e.target.id === "keywords")
        this.setState({keyWords: e.target.value})
    }
    render() {
        console.log(this.state.leaders) 
       console.log(this.state.keyWords) 
        
        return(
            <React.Fragment>
                <Header />
                <Menu />
                <Content title="Init System" fa="fa-file">
                <Row>
                        <Col className="col-lg-12">
                            <Panel>
                            <h4>To initiate new network please fill opinion leaders and keywords</h4>
                            <p><b>Please click ENTER after each person / keyword</b></p>
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-lg-6">
                            <Panel headeline="Opinion leaders">
                                <Row>
                                    <form className="form-inline" role="form">
                                        <textarea 
                                            className="form-control" 
                                            id="leaders"
                                            rows="10" 
                                            style={{width: "90%", marginLeft: "5%"}} 
                                            placeholder="opinion leaders" 
                                            value={this.state.leaders} 
                                            onChange={this.handleChange}
                                        />
                                    </form>
                                </Row>
                            </Panel>
                        </Col>
                        <Col className="col-lg-6">
                            <Panel headeline="keywords">
                                <Row>
                                    <form className="form-inline" role="form">
                                        <textarea 
                                            className="form-control" 
                                            id="keywords"
                                            rows="10" 
                                            style={{width: "90%", marginLeft: "5%"}} 
                                            placeholder="keywords" 
                                            value={this.state.keyWords} 
                                            onChange={this.handleChange}
                                            />                                    
                                    </form>
                                </Row>
                            </Panel>
                        </Col>
                    </Row>
                    <button type="button" className="btn btn-theme03" onClick={this.handleClick}>Submit</button>
                </Content>
                <Footer />
            </React.Fragment>
        )
    }
}

export default Initiation;