import React from 'react'
import {Route} from 'react-router-dom'
import GraphPage from '../components/Pages/GraphPage'
import CommunityPage from '../components/Pages/CommunityPage'
import LoginPage from '../components/Pages/Login.page'
import withAuth from '../components/withAuth';
import addLeader from '../components/Pages/AddLeader.page'
import ProfilePage from '../components/Pages/Profile.page'


const ReactRouter = () => {
    return (
        <React.Fragment>
            <Route exact path="/" component={withAuth(GraphPage)} />
            <Route exact path="/community" component={withAuth(CommunityPage)} />
            <Route exact path="/community/:twitter_screen_name" component={withAuth(ProfilePage)} />
            <Route exact path="/addLeader" component={withAuth(addLeader)} />
            <Route exact path="/login" component={LoginPage} />
        </React.Fragment>
    )
}

export default ReactRouter;