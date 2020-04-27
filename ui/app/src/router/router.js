import React from 'react'
import {Route} from 'react-router-dom'
import Header from '../components/Header'
import Menu from '../components/Menu'
import Footer from '../components/Footer'
import GraphPage from '../components/Pages/GraphPage'
import CommunityPage from '../components/Pages/CommunityPage'
import LoginPage from '../components/Pages/Login.page'

const ReactRouter = () => {
    return (
        <React.Fragment>
            <Route exact path="/" component={GraphPage} />
            {/* <Route exact path="/community" component={CommunityPage} /> */}
            <Route exact path="/login" component={LoginPage} />
        </React.Fragment>
    )
}

export default ReactRouter;