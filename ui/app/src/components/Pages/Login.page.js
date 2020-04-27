import React, { Component } from 'react'

class LoginPage extends Component {
    
    constructor(props) {
        super(props)
    }

    render() {
        return (
                <form>
                    <div className="centered login-logo">
                        <img src="img/logo.png" width="120" height="120" />
                        <h3>Makhela</h3>
                    </div>
                    <div id="showtime"></div>
                    <div className="col-lg-4 col-lg-offset-4">
                        <div className="lock-screen">
                            <h2><a data-toggle="modal" href="#myModal"><i className="fa fa-lock"></i></a></h2>
                            <p>LOGIN</p>
                            <div aria-hidden="true" aria-labelledby="myModalLabel" role="dialog" tabindex="-1" id="myModal" className="modal fade">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                            <h4 className="modal-title">Welcome</h4>
                                        </div>
                                            <div className="modal-body">
                                                <p className="centered"><img className="img-circle" width="80" src="img/unknown.jpeg" /></p>
                                                <input type="text" name="username" placeholder="Username" autocomplete="off" className="form-control placeholder-no-fix" /><br />
                                                <input type="password" name="password" placeholder="Password" autocomplete="off" className="form-control placeholder-no-fix" />
                                            </div>
                                            <div className="modal-footer centered">
                                                <button data-dismiss="modal" className="btn btn-theme04" type="button">Cancel</button>
                                                <button className="btn btn-theme03" type="button">Login</button>
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