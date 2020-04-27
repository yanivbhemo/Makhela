import React, {Component} from 'react'
import * as CONSTS from '../../consts'
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'

class Community_stats_panel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opinion_leaders_size: <Loader height={10} width={10} color="#00BFFF" type="Oval" />,
      suggestions_size: <Loader height={10} width={10} color="#00BFFF" type="Oval" />
    }
  }

  componentDidMount() {
    let url = CONSTS.OPINION_LEADERS_SIZE
    fetch(url)
    .then(res => res.json())
    .then(data => this.setState({opinion_leaders_size: data}))
    .catch(err => console.log(err))

    url = CONSTS.SUGGESTIONS_COLLECTION_SIZE
    fetch(url)
    .then(res => res.json())
    .then(data => this.setState({suggestions_size: data}))
    .catch(err => console.log(err))
  }
    render() {
        return(
            <div className="darkblue-panel pn">
              <div className="darkblue-header">
                <h5>Community Statistcs</h5>
              </div>
              <div className="row">
                <div className="col-xs-6">
                  <h1 className="mt"><i className="fa fa-user fa-3x" style={{color: "#AF55C9"}}></i></h1>
                  <p>Opinion Leaders</p>
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

class Posts_collected_panel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      posts_amount: <Loader height={10} width={10} color="#00BFFF" type="Oval" />,
    }
  }

  componentDidMount() {
    let url = CONSTS.POSTS_COLLECTION_SIZE
    fetch(url)
    .then(res => res.json())
    .then(data => this.setState({posts_amount: data}))
    .catch(err => console.log(err))
  }

    render() {
      return (
        <div className="twitter-panel pn" style={{color: "white"}}>
          <i className="fa fa-twitter fa-4x"></i>
          <h2>{this.state.posts_amount}</h2>
          <h4>Posts collected</h4>
        </div>
      )
    }
}

class Health_dashboard_panel extends Component {
  constructor(props) {
    super(props)
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
                          <td><i className="fa fa-check fa-1x" style={{color:"chartreuse"}}></i></td>
                        </tr>
                        <tr>
                          <td>Tweets Collector</td>
                          <td><i className="fa fa-check fa-1x" style={{color:"chartreuse"}}></i></td>
                        </tr>
                        <tr>
                          <td>Connection Collector</td>
                          <td><i className="fa fa-check fa-1x" style={{color:"chartreuse"}}></i></td>
                        </tr>
                        <tr>
                          <td>Community DB</td>
                          <td><i className="fa fa-check fa-1x" style={{color:"chartreuse"}}></i></td>
                        </tr>
                      </tbody>
                    </table>
                  </footer>
                </div>
      )
    }
}

export default Community_stats_panel;
export {
  Posts_collected_panel,
  Health_dashboard_panel
}