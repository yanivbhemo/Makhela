import React, { Component } from 'react'

class ErrorPage extends Component {
    
    constructor(props){
        super(props)
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
                            <h2>404 Page not found!</h2>
                        </div>
                    </div> 
                </form>
        )
    }
}

export default ErrorPage;
