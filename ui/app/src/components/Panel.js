import React, { Component } from 'react'

class Panel extends Component {
    constructor(props) {
        super(props)
        this.renderWithHeadline = this.renderWithHeadline.bind(this)
        this.renderWithoutHeadline = this.renderWithoutHeadline.bind(this)
    }

    renderWithoutHeadline() {
      return (
      <section className="panel">
        <header className="panel-heading">
          {this.props.children}
        </header>
      </section>
      )
    }

    renderWithHeadline() {
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

    render() {
        return(
            !this.props.headeline ? <this.renderWithoutHeadline /> : <this.renderWithHeadline />
        )
    }
}

export default Panel;