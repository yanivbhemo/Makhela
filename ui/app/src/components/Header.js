import React, { Component } from 'react'

class Header extends Component {
    // constructor(props) {
    //     super(props)
    // }

    componentDidMount() {
        // document.title = "TEST"
    }

    render() {
        return (
            <header className="header black-bg">
                {/* logo start */}
                <a href="index.html" className="logo"><b>Makhela</b></a>
                {/* <!--logo end--> */}
                
                <div className="top-menu">
                    <ul className="nav pull-right top-menu">
                    <li><a className="logout" href="login.html">Logout</a></li>
                    </ul>
                </div>
            </header>
        )
    }
}

export default Header;