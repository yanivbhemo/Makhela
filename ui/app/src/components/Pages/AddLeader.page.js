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
<<<<<<< HEAD
            twitter_screen_name: '',
            error_fullname: '',
            class_fullname: 'form-group',
            errorlbl:''
=======
            twitter_id: '',
            keywords: []
>>>>>>> 96ab1366edc726d1cfc0d41f88dd6db82d995251
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
<<<<<<< HEAD
=======
        console.log(name, value)
>>>>>>> 96ab1366edc726d1cfc0d41f88dd6db82d995251
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
<<<<<<< HEAD
        if(this.state.full_name === ''){
            this.setState({class_fullname:'form-group has-error', error_fullname: 'All fields must be filled!'})
            return
        }
        this.setState({class_fullname: 'form-group', class_twitterid: 'form-group', error_fullname:'', error_twitterid:''})
        fetch(CONSTS.ADD_NEW_LEADER, {
=======
        fetch(CONSTS.AUTHENTICATION_URL, {
>>>>>>> 96ab1366edc726d1cfc0d41f88dd6db82d995251
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
          })
          .then(res => {
            if (res.status === 200) {
<<<<<<< HEAD
                this.setState({errorlbl: false})
                alert("Leader added successfuly")
                window.location.href = "/community"
            } else {
                this.setState({errorlbl:'exist'})
=======
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
>>>>>>> 96ab1366edc726d1cfc0d41f88dd6db82d995251
            }
          })
          .catch(err => {
            console.error(err);
            this.setState({error: 'password'})
          });
    }

<<<<<<< HEAD
    handleError(msg) {
        return (
            <div className="alert alert-danger mt"><b>Oh snap!</b> {msg}</div>
        )
    }

=======
>>>>>>> 96ab1366edc726d1cfc0d41f88dd6db82d995251
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
<<<<<<< HEAD
                            <div className={this.state.class_fullname}>
                            <label className="col-lg-2 control-label">Full Name</label>
                            <div className="col-lg-10">
                                <input type="text" placeholder="" value={this.state.full_name} onChange={this.handleInputChange} name="full_name" className="form-control" />
                                <p className="help-block">{this.state.error_fullname}</p>
=======
                            <div className="form-group">
                            <label className="col-lg-2 control-label">Full Name</label>
                            <div className="col-lg-10">
                                <input type="text" placeholder="" value={this.state.full_name} onChange={this.handleInputChange} name="full_name" className="form-control" />
                                <p className="help-block"></p>
>>>>>>> 96ab1366edc726d1cfc0d41f88dd6db82d995251
                            </div>
                            </div>
                            <div className="form-group">
                            <label className="col-lg-2 control-label">Twitter Screen Name</label>
                            <div className="col-lg-10">
<<<<<<< HEAD
                                <input type="text" placeholder="" value={this.state.twitter_screen_name} onChange={this.handleInputChange} name="twitter_screen_name" className="form-control" />
=======
                                <input type="text" placeholder="" value={this.state.twitter_id} onChange={this.handleInputChange} name="twitter_id" className="form-control" />
                                <p className="help-block"></p>
                            </div>
                            </div>
                            <div className="form-group">
                            <label className="col-lg-2 control-label">keywords (Place ; between each word)</label>
                            <div className="col-lg-10">
                                <input type="text" placeholder="" value={this.state.keywords} onChange={this.handleInputChange} name="keywords" className="form-control" />
                                <p className="help-block"></p>
>>>>>>> 96ab1366edc726d1cfc0d41f88dd6db82d995251
                            </div>
                            </div>
                            <div className="form-group">
                            <div className="col-lg-offset-2 col-lg-10">
                                <button className="btn btn-success" type="submit">Add</button>
<<<<<<< HEAD
                                {!this.state.errorlbl ? '' : this.handleError("Leader already exist")}
=======
>>>>>>> 96ab1366edc726d1cfc0d41f88dd6db82d995251
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