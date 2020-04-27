import React from 'react'
import {Route} from 'react-router-dom'
import Header from '../components/Header'
import Menu from '../components/Menu'
import GraphPage from '../components/Pages/GraphPage'
import CommunityPage from '../components/Pages/CommunityPage'

const ReactRouter = () => {
    return (
        <React.Fragment>
            <Header />
            <Menu />
            <Route exact path="/" component={GraphPage} />
            <Route exact path="/community" component={CommunityPage} />
        </React.Fragment>
    )
}

export default ReactRouter;