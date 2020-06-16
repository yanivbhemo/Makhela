import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import * as CONSTS from '../consts'
import Cookies from 'js-cookie';

class Menu extends Component {
    constructor(props) {
        super(props)
        this.state = {
            initSystem: false
        }
    }

    componentWillMount(){
        const url = CONSTS.CHECK_IF_SYSTEM_INIT
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res => {
            if(res.status === 200){
                this.setState({initSystem: true})
            }
        })
    }
    
    render() {
        if(this.state.initSystem === true) {
            return (
                <aside>
                    <div id="sidebar" className="nav-collapse " tabIndex="5000" style={{overflow: "hidden", outline: "none"}}>
                        {/* <!-- sidebar menu start--> */}
                        <ul className="sidebar-menu" id="nav-accordion">
                        <p className="centered"><a href="/"><img src="/img/unknown.jpeg" className="img-circle" width="80" alt="User-Icon" /></a></p>
                        <h5 className="centered">{sessionStorage.getItem('user_fullname')}</h5>
                        <li className="sub-menu">
                            <NavLink exact to="/initiation">
                            <i className="fa fa-file"></i>
                            <span>Init System</span>
                            </NavLink>
                        </li>
                        <li className="sub-menu">
                            <NavLink exact to="/settings">
                              <i className="fa fa-cogs"></i>
                              <span>Settings</span>
                            </NavLink>
                        </li>
                        </ul>
                        {/* <!-- sidebar menu end--> */}
                    </div>
                </aside>
            )
        } else if (sessionStorage.getItem('user_role') === "Analyst" ){
            return (
                <aside>
                    <div id="sidebar" className="nav-collapse " tabIndex="5000" style={{overflow: "hidden", outline: "none"}}>
                        {/* <!-- sidebar menu start--> */}
                        <ul className="sidebar-menu" id="nav-accordion">
                        <p className="centered"><a href="profile.html"><img src="/img/unknown.jpeg" className="img-circle" width="80" alt="User-Icon" /></a></p>
                        <h5 className="centered">{sessionStorage.getItem('user_fullname')}</h5>
                        <h6 className="centered">{sessionStorage.getItem('user_role')}</h6>
                        
                            <li className="mt">
                                <NavLink exact to="/">
                                    <i className="fa fa-home"></i>
                                    <span>Network Overview</span>
                                </NavLink>
                            </li>
                        <li className="sub-menu">
                            <NavLink exact to="/community">
                                <i className="fa fa-users"></i>
                                <span>Influencers</span>
                            </NavLink>
                        </li>
                        <li className="sub-menu">
                            <NavLink exact to="/suggestions">
                            <i className="fa fa-plus"></i>
                            <span>Suggestions</span>
                            </NavLink>
                        </li>
                        <li className="sub-menu">
                            <NavLink exact to="/ignoreList">
                            <i className="fa fa-times"></i>
                            <span>Ignore List</span>
                            </NavLink>
                        </li>
                        </ul>
                        {/* <!-- sidebar menu end--> */}
                    </div>
                </aside>
            )
        } else if(sessionStorage.getItem('user_role') === "Reasercher"){
            return (
                <aside>
                    <div id="sidebar" className="nav-collapse " tabIndex="5000" style={{overflow: "hidden", outline: "none"}}>
                        {/* <!-- sidebar menu start--> */}
                        <ul className="sidebar-menu" id="nav-accordion">
                        <p className="centered"><a href="profile.html"><img src="/img/unknown.jpeg" className="img-circle" width="80" alt="User-Icon" /></a></p>
                        <h5 className="centered">{sessionStorage.getItem('user_fullname')}</h5>
                        <h6 className="centered">{sessionStorage.getItem('user_role')}</h6>
                        
                            <li className="mt">
                                <NavLink exact to="/">
                                    <i className="fa fa-home"></i>
                                    <span>Network Overview</span>
                                </NavLink>
                            </li>
                        <li className="sub-menu">
                            <NavLink exact to="/community">
                                <i className="fa fa-users"></i>
                                <span>Influencers</span>
                            </NavLink>
                        </li>
                        <li className="sub-menu">
                            <NavLink exact to="/research">
                                <i className="fa fa-pie-chart"></i>
                                <span>Research</span>
                            </NavLink>
                        </li>
                        </ul>
                        {/* <!-- sidebar menu end--> */}
                    </div>
                </aside>
            )
        }
        else {
            return (
                <aside>
                    <div id="sidebar" className="nav-collapse " tabIndex="5000" style={{overflow: "hidden", outline: "none"}}>
                        {/* <!-- sidebar menu start--> */}
                        <ul className="sidebar-menu" id="nav-accordion">
                        <p className="centered"><a href="profile.html"><img src="/img/unknown.jpeg" className="img-circle" width="80" alt="User-Icon" /></a></p>
                        <h5 className="centered">{sessionStorage.getItem('user_fullname')}</h5>
                        <h6 className="centered">{sessionStorage.getItem('user_role')}</h6>
                        
                            <li className="mt">
                                <NavLink exact to="/">
                                    <i className="fa fa-home"></i>
                                    <span>Network Overview</span>
                                </NavLink>
                            </li>
                        <li className="sub-menu">
                            <NavLink exact to="/community">
                                <i className="fa fa-users"></i>
                                <span>Influencers</span>
                            </NavLink>
                        </li>
                        <li className="sub-menu">
                            <NavLink exact to="/research">
                                <i className="fa fa-pie-chart"></i>
                                <span>Research</span>
                            </NavLink>
                        </li>
                        <li className="sub-menu">
                            <NavLink exact to="/suggestions">
                            <i className="fa fa-plus"></i>
                            <span>Suggestions</span>
                            </NavLink>
                        </li>
                        <li className="sub-menu">
                            <NavLink exact to="/ignoreList">
                            <i className="fa fa-times"></i>
                            <span>Ignore List</span>
                            </NavLink>
                        </li>
                        <li className="sub-menu">
                            <NavLink exact to="/settings">
                              <i className="fa fa-cogs"></i>
                              <span>Settings</span>
                            </NavLink>
                        </li>
                        </ul>
                        {/* <!-- sidebar menu end--> */}
                    </div>
                </aside>
            )
        }
    }
}

export default Menu;