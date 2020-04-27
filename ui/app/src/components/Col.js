import React, { Component } from 'react'

class Col extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <div className={this.props.className}>
                {this.props.children}
            </div>
        )
    }
}

export default Col;