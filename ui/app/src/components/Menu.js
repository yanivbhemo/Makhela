import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';

class Menu extends Component {
    // constructor(props) {
    //     super(props)
    // }
    
    render() {
        return (
            <aside>
                <div id="sidebar" className="nav-collapse " tabIndex="5000" style={{overflow: "hidden", outline: "none"}}>
                    {/* <!-- sidebar menu start--> */}
                    <ul className="sidebar-menu" id="nav-accordion">
                    <p className="centered"><a href="profile.html"><img src="img/unknown.jpeg" className="img-circle" width="80" alt="User-Icon" /></a></p>
                    <h5 className="centered">{sessionStorage.getItem('user_fullname')}</h5>
                    
                        <li className="mt">
                            <NavLink exact to="/">
                                <i className="fa fa-home"></i>
                                <span>Main Graph</span>
                            </NavLink>
                        </li>
                    <li className="sub-menu">
                        <NavLink exact to="/community">
                            <i className="fa fa-users"></i>
                            <span>Community</span>
                        </NavLink>
                    </li>
                    <li className="sub-menu">
                        <a href="suggestions.html">
                        <i className="fa fa-plus"></i>
                        <span>Suggestions</span>
                        </a>
                    </li>
                    <li className="sub-menu">
                        <a href="settings.html">
                        <i className="fa fa-cogs"></i>
                        <span>Settings</span>
                        </a>
                    </li>
                    </ul>
                    {/* <!-- sidebar menu end--> */}
                </div>
            </aside>
        )
    }
}

export default Menu;