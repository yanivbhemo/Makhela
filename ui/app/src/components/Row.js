import React, { Component } from 'react'

class Row extends Component {
    // constructor(props) {
    //     super(props)
    // }

    render() {
        return(
            <div className={this.props.className || 'row'} id={this.props.id}>
                {this.props.children}
            </div>
        )
    }
}

export default Row;