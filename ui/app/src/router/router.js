import React from 'react'
import {Route} from 'react-router-dom'
import GraphPage from '../components/Pages/GraphPage'
import CommunityPage from '../components/Pages/CommunityPage'
import LoginPage from '../components/Pages/Login.page'
import withAuth from '../components/withAuth';


const ReactRouter = () => {
    return (
        <React.Fragment>
            <Route exact path="/" component={withAuth(GraphPage)} />
            <Route exact path="/community" component={withAuth(CommunityPage)} />
            <Route exact path="/login" component={LoginPage} />
        </React.Fragment>
    )
}

export default ReactRouter;