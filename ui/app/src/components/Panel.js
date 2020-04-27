import React, { Component } from 'react'

class Panel extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <section className="panel">
              <header className="panel-heading">
                {this.props.headeline}
              </header>
              <div className="panel-body">
                {this.props.children}
              </div>
            </section>
        )
    }
}

export default Panel;