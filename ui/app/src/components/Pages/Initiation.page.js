import React, { Component } from 'react'
import Content from '../Content'
import Row from '../Row'
import Col from '../Col'
import Panel from '../Panel'
import Header from '../Header'
import Footer from '../Footer'
import Menu from '../Menu'
import ModalBox from '../ModalBox'
import * as CONSTS from '../../consts'
import Cookies from 'js-cookie';



class Initiation extends Component {
    constructor() {
        super()
        this.state = {
            leaders: '',
            keyWords: '',
            showModal: false
          }
        this.checkForDuplication = this.checkForDuplication.bind(this)
    }

    componentDidMount() {
        document.title = "Initiation"
        const url = CONSTS.CHECK_IF_SYSTEM_INIT
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res => {
            if(res.status === 403){
                // this.props.history.push('/')
                console.log("System not initilize")
            }
        })
    }

    checkForDuplication() {
        var leaders_arr = this.state.leaders.split(/\r\n|\n/)
        let count = 0
        for(var i = 0; i < leaders_arr.length; i++) {
            for(var j = 0; j < leaders_arr.length; j++) {
                if(leaders_arr[i] === leaders_arr[j]){                    
                    count++
                }
                if(count > 1){
                    return leaders_arr[i]
                }
            }
            count = 0
        }

        var keywords_arr = this.state.keyWords.split(/\r\n|\n/)
        count = 0
        for(let i = 0; i < keywords_arr.length; i++) {
            for(let j = 0; j < keywords_arr.length; j++) {
                if(keywords_arr[i] === keywords_arr[j])                   
                    count++
                if(count > 1)
                    return keywords_arr[i]
            }
            count = 0
        }
        return true
    }

    handleClick = () => {
        var duplication = this.checkForDuplication()
        if(duplication===true) {
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
            .then(res =>{
                if(res.status === 200)
                    this.setState({
                        leaders: '',
                        keyWords: '',
                        showModal: true
                    })
            })
            .then(data => console.log(data))
            .catch(err => console.log(err))
        }
        else{
            alert("Duplications: " + duplication)
        }
    }
    handleChange = e => {
        if(e.target.id === "leaders")
            this.setState({leaders: e.target.value})
        else if(e.target.id === "keywords") 
            this.setState({keyWords: e.target.value})
    }
    render() {
        return(
            <React.Fragment>
                <Header />
                <Menu />
                <Content title="Init System" fa="fa-file">
                    <ModalBox 
                        show={this.state.showModal}
                        title="System initiation"
                        onClose={() => this.setState({showModal:false})}
                    >
                        Influencers and Keywords saved.
                        <br/>
                        System began collectiong network.
                    </ModalBox>
                    <Row>
                        <Col className="col-lg-12">
                            <Panel>
                            <h4>To initiate new network please fill influencers and keywords</h4>
                            <p><b>Please click ENTER after each person / keyword</b></p>
                            </Panel>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="col-lg-6">
                            <Panel headeline="Influencers">
                                <Row>
                                    <form className="form-inline" role="form">
                                        <textarea 
                                            className="form-control" 
                                            id="leaders"
                                            rows="10" 
                                            style={{width: "90%", marginLeft: "5%"}} 
                                            placeholder="influencers" 
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
