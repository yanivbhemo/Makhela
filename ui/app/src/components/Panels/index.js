import React from 'react'

export const community_stats_panel = () => {
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
                      <h5>190</h5>
                    </div>
                  </footer>
                </div>
                <div className="col-xs-6">
                  <h1 className="mt"><i className="fa fa-user fa-3x" style={{color: "#00A9F3"}}></i></h1>
                  <p>New suggestions</p>
                  <footer>
                    <div className="centered">
                      <h5>600</h5>
                    </div>
                  </footer>
                </div>
              </div>
            </div>
      )
}

export const posts_collected_panel = () => {
  return (
    <div className="twitter-panel pn" style={{color: "white"}}>
      <i className="fa fa-twitter fa-4x"></i>
      <h2>17,000</h2>
      <h4>Posts collected</h4>
    </div>
  )
}

export const health_dashboard_panel = () => {
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