import React, { Component } from 'react'
import Cookies from 'js-cookie';

class Header extends Component {
    constructor(props) {
        super(props)
        this.onLogoutClick = this.onLogoutClick.bind(this)
    }

    onLogoutClick(){
        Cookies.remove('token')
        window.location.reload();
    }

    render() {
        return (
            <header className="header black-bg">
                {/* logo start */}
                <a href="index.html" className="logo"><b>Makhela</b></a>
                {/* <!--logo end--> */}
                
                <div className="top-menu">
                    <ul className="nav pull-right top-menu">
                        <li><button className="logout" onClick={this.onLogoutClick}>Logout</button></li>
                    </ul>
                    {/* <ul className="nav pull-left top-menu" style={{marginLeft: "20px"}}>
                        <li><a className="logout" href="login.html">Main</a></li>
                    </ul> */}
                </div>
            </header>
        )
    }
}

export default Header;