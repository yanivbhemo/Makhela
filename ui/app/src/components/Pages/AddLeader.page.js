import React, { Component } from 'react'
import Content from '../Content'
import Row from '../Row'
import Col from '../Col'
import Header from '../Header'
import Menu from '../Menu'
import Footer from '../Footer'
import * as CONSTS from '../../consts'

class AddUser extends Component {
    constructor(props) {
        super(props)
        this.state = {
            full_name: '',
            twitter_screen_name: '',
            error_fullname: '',
            class_fullname: 'form-group',
            errorlbl:''
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        if(this.state.full_name === ''){
            this.setState({class_fullname:'form-group has-error', error_fullname: 'All fields must be filled!'})
            return
        }
        this.setState({class_fullname: 'form-group', class_twitterid: 'form-group', error_fullname:'', error_twitterid:''})
        fetch(CONSTS.ADD_NEW_LEADER, {
            method: 'POST',
            body: JSON.stringify(this.state),
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'same-origin'
          })
          .then(res => {
            if (res.status === 200) {
                this.setState({errorlbl: false})
                alert("Leader added successfuly")
                window.location.href = "/community"
            } else {
                this.setState({errorlbl:'exist'})
            }
          })
          .catch(err => {
            console.error(err);
            this.setState({error: 'password'})
          });
    }

    handleError(msg) {
        return (
            <div className="alert alert-danger mt"><b>Oh snap!</b> {msg}</div>
        )
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
                            <div className={this.state.class_fullname}>
                            <label className="col-lg-2 control-label">Full Name</label>
                            <div className="col-lg-10">
                                <input type="text" placeholder="" value={this.state.full_name} onChange={this.handleInputChange} name="full_name" className="form-control" />
                                <p className="help-block">{this.state.error_fullname}</p>
                            </div>
                            </div>
                            <div className="form-group">
                            <label className="col-lg-2 control-label">Twitter Screen Name</label>
                            <div className="col-lg-10">
                                <input type="text" placeholder="" value={this.state.twitter_screen_name} onChange={this.handleInputChange} name="twitter_screen_name" className="form-control" />
                            </div>
                            </div>
                            <div className="form-group">
                            <div className="col-lg-offset-2 col-lg-10">
                                <button className="btn btn-success" type="submit">Add</button>
                                {!this.state.errorlbl ? '' : this.handleError("Leader already exist")}
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