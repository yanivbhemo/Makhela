import React, { Component } from 'react'
import {AUTHENTICATION_URL, AUTH_CHECK_TOKEN, CONNECT_TO_DB} from '../../consts'
import Cookies from 'js-cookie';

class LoginPage extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            error: '',
            organization: ''
        }
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
        this.handleError = this.handleError.bind(this)
    }

    handleInputChange = (event) => {
        const { value, name } = event.target;
        this.setState({
            [name]: value
        });
    }

    onSubmit = (event) => {
        event.preventDefault();
        fetch(AUTHENTICATION_URL, {
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
                        sessionStorage.setItem('user_role',res2.user_role)
                        document.cookie = "token="+res2.token
                        window.location.href = "/"
                    }
                )
            } else {
              this.setState({error: 'Incorrect email or password'})
            }
          })
          .catch(err => {
            console.error(err);
            this.setState({error: 'Cannot communicate with the server'})
          });
    }

    componentDidMount() {
        var org = ''
        var text1 = document.location.href
        var text1_arr = text1.split(".")
        if(text1_arr[0] === "http://www" || text1_arr[0] === "https://www") {
            org = text1_arr[1].toLowerCase()
        } else {
            text1_arr = text1.split("/")[2].split('.')
            org = text1_arr[0].toLowerCase()
        }
        if(/^[a-z1-9]+$/.test(org) === true) {
            fetch(CONNECT_TO_DB, {
                method: 'POST',
                body: JSON.stringify({database_name: org}),
                headers: {
                  'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
              })
              .then(res => {
                  if(res.status === 200){
                        this.setState({organization:org})
                        document.body.style.backgroundImage = 'url("img/login-bg.jpg")'
                        if(document.cookie) {
                            let url = AUTH_CHECK_TOKEN + Cookies.get('token')
                            fetch(url)
                            .then(res => {
                                if (res.status === 200) {
                                    window.location.href = "/"
                                }
                            })
                            .then(data => console.log(data))
                            .catch(err => console.log(err))
                        }
                    }
                    else {
                        window.location.href = "/404"
                    }
              })
        }
    }

    handleError(msg) {
        return (
            <div className="alert alert-danger mt"><b>Oh snap! </b>{msg}</div>
        )
    }

    render() {
        return (
                <form onSubmit={this.onSubmit}>
                    <div className="centered login-logo">
                        <img src="img/logo.png" width="120" height="120" alt="logo" />
                        <h3>Makhela</h3>
                    </div>
                    <div id="showtime"></div>
                    <div className="col-lg-4 col-lg-offset-4">
                        <div className="lock-screen">
                            <h2><a data-toggle="modal" href="#myModal"><i className="fa fa-lock"></i></a></h2>
                            <p style={{color:"white"}}>LOGIN</p>
                            <div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabIndex="-1" id="myModal" className="modal fade">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                            <h4 className="modal-title">Welcome</h4>
                                        </div>
                                            <div className="modal-body">
                                                <p className="centered"><img className="img-circle" width="80" src="img/unknown.jpeg" alt="user img" /></p>
                                                <input type="text" name="organization" disabled placeholder="organization" value={this.state.organization} required className="form-control placeholder-no-fix" /><br />
                                                <input type="text" name="username" placeholder="Username" value={this.state.username} onChange={this.handleInputChange} required autoComplete="off" className="form-control placeholder-no-fix" /><br />
                                                <input type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.handleInputChange} required autoComplete="off" className="form-control placeholder-no-fix" />
                                                {!this.state.error ? '' : this.handleError(this.state.error)}
                                            </div>
                                            <div className="modal-footer centered">
                                                <button data-dismiss="modal" className="btn btn-theme04" type="button">Cancel</button>
                                                <input type="submit" className="btn btn-theme03" value="Login" />
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> 
                </form>
        )
    }
}

export default LoginPage;
