import React, {Component} from 'react'
import * as CONSTS from '../../consts'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie';
import ReactImageFallback from "react-image-fallback";


class CommunityPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opinion_leaders_size: <Loader height={10} width={10} color="#00BFFF" type="Oval" />,
      suggestions_size: <Loader height={10} width={10} color="#00BFFF" type="Oval" />
    }
  }

  componentDidMount() {
    let url = CONSTS.OPINION_LEADERS_SIZE
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({"token":Cookies.get('token')}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => this.setState({opinion_leaders_size: data}))
    .catch(err => console.log(err))

    url = CONSTS.SUGGESTIONS_COLLECTION_SIZE
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({"token":Cookies.get('token')}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => this.setState({suggestions_size: data}))
    .catch(err => console.log(err))
  }
    render() {
        return(
            <div className="darkblue-panel pn">
              <div className="darkblue-header">
                <h5>Influencers</h5>
              </div>
              <div className="row">
                <div className="col-xs-6">
                  <h1 className="mt"><i className="fa fa-user fa-3x" style={{color: "#AF55C9"}}></i></h1>
                  <p>Influencers</p>
                  <footer>
                    <div className="centered">
                      <h5>{this.state.opinion_leaders_size}</h5>
                    </div>
                  </footer>
                </div>
                <div className="col-xs-6">
                  <h1 className="mt"><i className="fa fa-user fa-3x" style={{color: "#00A9F3"}}></i></h1>
                  <p>New suggestions</p>
                  <footer>
                    <div className="centered">
                      <h5>{this.state.suggestions_size}</h5>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
      )
    }
}

class PostsPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts_amount: <Loader height={10} width={10} color="#00BFFF" type="Oval" />,
    }
  }

  componentDidMount() {
    let url = CONSTS.POSTS_COLLECTION_SIZE
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({"token":Cookies.get('token')}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => this.setState({posts_amount: data}))
    .catch(err => console.log(err))
  }

    render() {
      return (
        <div className="twitter-panel pn" style={{color: "white"}}>
          <i className="fa fa-twitter fa-4x"></i>
          <h2>{this.state.posts_amount}</h2>
          <h4>Tweets collected</h4>
        </div>
      )
    }
}

class HealthPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      suggestions_collector_status: true,
      tweets_collector_status: true,
      connections_collector_status: true,
      analyzer_collector_status: true,
    }
  }

  componentDidMount() {
    let url = CONSTS.CONNECTIONS_COLLECTOR_STATUS
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({"token":Cookies.get('token')}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res =>{
      if(res.status===200){
        this.setState({connections_collector_status: false})
      } else {
        this.setState({connections_collector_status: true})
      }
    })
    .catch(err => console.log(err))
    
    url = CONSTS.SUGGESTIONS_COLLECTOR_STATUS
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({"token":Cookies.get('token')}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res =>{
      if(res.status===200){
        this.setState({suggestions_collector_status: false})
      } else {
        this.setState({suggestions_collector_status: true})
      }
    })
    .catch(err => console.log(err))

    url = CONSTS.TWEETS_COLLECTOR_STATUS
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({"token":Cookies.get('token')}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res =>{
      if(res.status===200){
        this.setState({tweets_collector_status: false})
      } else {
        this.setState({tweets_collector_status: true})
      }
    })
    .catch(err => console.log(err))

    url = CONSTS.ANALYZER_STATUS
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({"token":Cookies.get('token')}),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res =>{
      if(res.status===200){
        this.setState({analyzer_collector_status: false})
      } else {
        this.setState({analyzer_collector_status: true})
      }
    })
    .catch(err => console.log(err))

  }
    render() {
      return (
        <div className="darkblue-panel pn">
                  <div className="darkblue-header">
                    <h5>System Health</h5>
                  </div>
                  <footer>
                    <table className="table table-borderless table-sm">
                      <thead>
                        <tr>
                          <th>Component</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody id="health-check-dashboard-tbody">
                        <tr>
                          <td>Suggestions Collector</td>
                          <td>{(this.state.suggestions_collector_status===true) ? <i className="fa fa-check fa-1x" style={{color:"chartreuse"}}></i> : <Loader height={15} width={15} color="#00BFFF" type="Oval" />}</td>
                        </tr>
                        <tr>
                          <td>Tweets Collector</td>
                          <td>{(this.state.tweets_collector_status===true) ? <i className="fa fa-check fa-1x" style={{color:"chartreuse"}}></i> : <Loader height={15} width={15} color="#00BFFF" type="Oval" />}</td>
                        </tr>
                        <tr>
                          <td>Connection Collector</td>
                          <td>{(this.state.connections_collector_status===true) ? <i className="fa fa-check fa-1x" style={{color:"chartreuse"}}></i> : <Loader height={15} width={15} color="#00BFFF" type="Oval" />}</td>
                        </tr>
                        <tr>
                          <td>Analyzer</td>
                          <td>{(this.state.analyzer_collector_status===true) ? <i className="fa fa-check fa-1x" style={{color:"chartreuse"}}></i> : <Loader height={15} width={15} color="#00BFFF" type="Oval" />}</td>
                        </tr>
                      </tbody>
                    </table>
                  </footer>
                </div>
      )
    }
}

class LeaderPanel extends Component {
  constructor(props){
    super(props)
    this.moveToBlackList = this.moveToBlackList.bind(this)
    this.checkIfImageExist = this.checkIfImageExist.bind(this)
  }

  moveToBlackList(props) {
    this.props.onBlackListBtn(this.props.index)
  }

  checkIfImageExist(url) {
    return '/img/unknown.jpeg'
  }

  render(){
    return(
      <div>
      <div className="white-panel pn-auto">
        <div className="white-header">
          <div className="row" id="leader-panel-header">
            {this.props.newUser ? <div className="col-xs-4 col-md-4"><button type="button" className="btn btn-round btn-danger" onClick={this.moveToBlackList} data-toggle="modal" data-target="#blackListModal">Ignore List</button></div> : <div className="col-xs-4 col-md-4"><button style={{display: "none"}}></button></div>}
            <div className="col-xs-4 col-md-4">
              <h5>{this.props.full_name}</h5>
            </div>
          </div>
        </div>
        <Link to={(this.props.newUser) ? `/community/${this.props.twitter_screen_name}` : '#'} className="suggestions-links">
                        {/* <p><img src={this.checkIfImageExist(this.props.twitter_profile_image)} className="img-circle" width="80" alt="name"/></p> */}
                        <p>
                          <ReactImageFallback
                              src={this.props.twitter_profile_image}
                              fallbackImage="/img/unknown.jpeg"
                              initialImage="/img/unknown.jpeg"
                              alt={this.props.full_name}
                              className="img-circle"
                              width="80"
                              initialTimeout={5}
                              />
                        </p>
                        <p><b>{this.props.twitter_description}</b></p>
                        <div className="row">
                          <div className="col-xs-6 col-sm-3">
                              <h6>Twitter ID</h6>
                              <p>{this.props.twitter_screen_name}</p>
                          </div>
                          <div className="col-xs-6 col-sm-3">
                              <h6>Member Since</h6>
                              <p>{this.props.twitter_created_at}</p>
                          </div>
                          <div className="col-xs-6 col-sm-3">
                              <h6>Cert. Level</h6>
                              <p>{this.props.level_of_certainty}</p>
                          </div>
                          <div className="col-xs-6 col-sm-3">
                              <h6>Followers</h6>
                              <p>{this.props.twitter_followers_count}</p>
                          </div>
                        </div>
                        {!this.props.newUser ? <div className="row"><h4>New Leader. Yet collected</h4></div> : ''}
                    </Link>
      </div>
      </div>
    )
  }
}

class SuggestionPanel extends Component {
  constructor(props){
    super(props)
    this.moveToBlackList = this.moveToBlackList.bind(this)
    this.addToCommunity = this.addToCommunity.bind(this)
    this.checkIfImageExist = this.checkIfImageExist.bind(this)
  }

  moveToBlackList() {
    this.props.onBlackListBtn(this.props.index)
  }

  addToCommunity() {
    this.props.onAddBtn(this.props.index)
  }

  checkIfImageExist(url) {
    return '/img/unknown.jpeg'
  }

  render(){
    return(
      <div>
      <div className="white-panel pn-auto">
        <div className="white-header">
          <div className="row" id="leader-panel-header">
          {this.props.newUser ? <div className="col-xs-4 col-md-4"><button type="button" className="btn btn-round btn-success" onClick={this.addToCommunity} data-toggle="modal" data-target="#blackListModal">Add</button></div> : <div className="col-xs-4 col-md-4"><button style={{display: "none"}}></button></div>}
            <div className="col-xs-4 col-md-4">
              <h5>{this.props.full_name}</h5>
            </div>
            {this.props.newUser ? <div className="col-xs-4 col-md-4"><button type="button" className="btn btn-round btn-danger" onClick={this.moveToBlackList} data-toggle="modal" data-target="#blackListModal">Ignore List</button></div> : <div className="col-xs-4 col-md-4"><button style={{display: "none"}}></button></div>}
          </div>
        </div>
                        <p>
                          <ReactImageFallback
                              src={this.props.twitter_profile_image}
                              fallbackImage="/img/unknown.jpeg"
                              initialImage="/img/unknown.jpeg"
                              alt={this.props.full_name}
                              className="img-circle"
                              width="80"
                              initialTimeout={5}
                              />
                        </p>
                        <p><b>{this.props.twitter_description}</b></p>
                        <div className="row">
                          <div className="col-xs-6 col-sm-3">
                              <h6>Twitter ID</h6>
                              <p>{this.props.twitter_screen_name}</p>
                          </div>
                          <div className="col-xs-6 col-sm-3">
                              <h6>Member Since</h6>
                              <p>{this.props.twitter_created_at}</p>
                          </div>
                          <div className="col-xs-6 col-sm-3">
                              <h6>Cert. Level</h6>
                              <p>{this.props.level_of_certainty}</p>
                          </div>
                          <div className="col-xs-6 col-sm-3">
                              <h6>Followers</h6>
                              <p>{this.props.twitter_followers_count}</p>
                          </div>
                        </div>
                        {!this.props.newUser ? <div className="row"><h4>New Suggestion. Yet collected</h4></div> : ''}
      </div>
      </div>
    )
  }
}

class BlackListPanel extends Component {
  constructor(props){
    super(props)
    this.moveToBlackList = this.moveToBlackList.bind(this)
    this.checkIfImageExist = this.checkIfImageExist.bind(this)
    this.addToCommunity = this.addToCommunity.bind(this)
  }

  moveToBlackList() {
    this.props.onBlackListBtn(this.props.index)
  }

  addToCommunity() {
    this.props.onAddBtn(this.props.index)
  }

  checkIfImageExist(url) {
    return '/img/unknown.jpeg'
  }

  render(){
    return(
      <div>
      <div className="white-panel pn-auto">
        <div className="white-header">
          <div className="row" id="leader-panel-header">
          {this.props.newUser ? <div className="col-xs-4 col-md-4"><button type="button" className="btn btn-round btn-success" onClick={this.addToCommunity} data-toggle="modal" data-target="#blackListModal">Add</button></div> : <div className="col-xs-4 col-md-4"><button style={{display: "none"}}></button></div>}
            <div className="col-xs-4 col-md-4">
              <h5>{this.props.full_name}</h5>
            </div>
          </div>
        </div>
                        <p>
                          <ReactImageFallback
                              src={this.props.twitter_profile_image}
                              fallbackImage="/img/unknown.jpeg"
                              initialImage="/img/unknown.jpeg"
                              alt={this.props.full_name}
                              className="img-circle"
                              width="80"
                              initialTimeout={5}
                              />
                        </p>
                        <p><b>{this.props.twitter_description}</b></p>
                        <div className="row">
                          <div className="col-xs-6 col-sm-3">
                              <h6>Twitter ID</h6>
                              <p>{this.props.twitter_screen_name}</p>
                          </div>
                          <div className="col-xs-6 col-sm-3">
                              <h6>Member Since</h6>
                              <p>{this.props.twitter_created_at}</p>
                          </div>
                          <div className="col-xs-6 col-sm-3">
                              <h6>Cert. Level</h6>
                              <p>{this.props.level_of_certainty}</p>
                          </div>
                          <div className="col-xs-6 col-sm-3">
                              <h6>Followers</h6>
                              <p>{this.props.twitter_followers_count}</p>
                          </div>
                        </div>
                        {!this.props.newUser ? <div className="row"><h4>Not Collected</h4></div> : ''}
      </div>
      </div>
    )
  }
}

export default CommunityPanel;
export {
  PostsPanel,
  HealthPanel,
  LeaderPanel,
  SuggestionPanel,
  BlackListPanel
}