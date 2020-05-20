import React from 'react'
import {Route} from 'react-router-dom'
import GraphPage from '../components/Pages/GraphPage'
import CommunityPage from '../components/Pages/CommunityPage'
import LoginPage from '../components/Pages/Login.page'
import withAuth from '../components/withAuth';
import addLeader from '../components/Pages/AddLeader.page'
import ProfilePage from '../components/Pages/Profile.page'
import SuggestionsPage from '../components/Pages/Suggestions'
import BlackListPage from '../components/Pages/BlackList'
import SettingsPage from '../components/Pages/Settings'


const ReactRouter = () => {
    return (
        <React.Fragment>
            <Route exact path="/" component={withAuth(GraphPage)} />
            <Route exact path="/community" component={withAuth(CommunityPage)} />
            <Route exact path="/community/:twitter_screen_name" component={withAuth(ProfilePage)} />
            <Route exact path="/suggestions" component={withAuth(SuggestionsPage)} />
            <Route exact path="/blacklist" component={withAuth(BlackListPage)} />
            <Route exact path="/addLeader" component={withAuth(addLeader)} />
            <Route exact path="/settings" component={withAuth(SettingsPage)} />
            <Route exact path="/login" component={LoginPage} />
        </React.Fragment>
    )
}

export default ReactRouter;