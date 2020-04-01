import React from 'react'
import {Route} from 'react-router-dom'
import MoDSpecialist from './components/SuggestedLeader'
// import GroupList from '../Components/GroupList'
// import MyGroups from '../Components/MyGroups'
// import UpdateScore from '../Components/UpdateScore'
// import ScoreAndWins from '../Components/ScoreAndWins'
// import Header from '../Header'

const ReactRouter = () => {
    return(
        <React.Fragment>
            {/* <Header/> */}
            <Route path="/" component={MoDSpecialist}/>
            {/* <Route path="/MyGroups" component={MyGroups}/>
            <Route path="/UpdateScore" component={UpdateScore}/>
            <Route path="/ScoreAndWins" component={ScoreAndWins}/> */}

        </React.Fragment>
    )
}

export default ReactRouter