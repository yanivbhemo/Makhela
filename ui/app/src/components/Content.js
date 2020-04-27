import React, { Component } from 'react'

const faStyle = {
    paddingRight: "10px"
}

class Content extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return(
            <section id="main-content">
                <section className="wrapper site-min-height">
                    <h3>
                    <i className={`fa + ${this.props.fa}`} style={faStyle}></i>
                    {this.props.title}
                    </h3>
                    {this.props.children}
                </section>
            </section>
        )
    }
}

export default Content;