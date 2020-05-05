import React, { Component } from 'react'
import Content from '../Content'
import Row from '../Row'
import Col from '../Col'
import Panel from '../Panel'
import Header from '../Header'
import Menu from '../Menu'
import Footer from '../Footer'
import { LeaderPanel } from '../Panels'
import * as CONSTS from '../../consts'

class AddUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            full_name: '',
            twitter_id: '',
            keywords: []
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        console.log(name, value)
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        fetch(CONSTS.AUTHENTICATION_URL, {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
          })
          .then(res => {
            if (res.status === 200) {
                res.json().then(
                    res2 => {
                        this.setState({error: ''})
                        console.log(res2)
                        sessionStorage.setItem('user_fullname',res2.full_name)
                        document.cookie = "token="+res2.token
                        window.location.href = "/"
                    }
                )
            } else {
              const error = new Error(res.error);
              throw error;
            }
          })
          .catch(err => {
            console.error(err);
            this.setState({error: 'password'})
          });
    }

    render() {
        return (
            <React.Fragment>
                <Header />
                <Menu />
                <Content title="Add a Leader" fa="fa-users" loadingActive={false}>
                <Row>
                    <Col className="col-lg-12">
                        <div className="form-panel">
                        <form onSubmit={this.onSubmit} className="form-horizontal style-form">
                            <div className="form-group">
                            <label className="col-lg-2 control-label">Full Name</label>
                            <div className="col-lg-10">
                                <input type="text" placeholder="" value={this.state.full_name} onChange={this.handleInputChange} name="full_name" className="form-control" />
                                <p className="help-block"></p>
                            </div>
                            </div>
                            <div className="form-group">
                            <label className="col-lg-2 control-label">Twitter Screen Name</label>
                            <div className="col-lg-10">
                                <input type="text" placeholder="" value={this.state.twitter_id} onChange={this.handleInputChange} name="twitter_id" className="form-control" />
                                <p className="help-block"></p>
                            </div>
                            </div>
                            <div className="form-group">
                            <label className="col-lg-2 control-label">keywords (Place ; between each word)</label>
                            <div className="col-lg-10">
                                <input type="text" placeholder="" value={this.state.keywords} onChange={this.handleInputChange} name="keywords" className="form-control" />
                                <p className="help-block"></p>
                            </div>
                            </div>
                            <div className="form-group">
                            <div className="col-lg-offset-2 col-lg-10">
                                <button className="btn btn-success" type="submit">Add</button>
                            </div>
                            </div>
                        </form>
                        </div>
                    </Col>
                </Row>
                </Content>
                <Footer />
            </React.Fragment>
        )
    }
}

export default AddUser