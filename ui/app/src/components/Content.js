import React, { Component } from 'react'
import LoadingOverlay from 'react-loading-overlay';

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
                <LoadingOverlay
                        active={this.props.loadingActive}
                        spinner
                        text='Loading the community'
                >
                <section className="wrapper site-min-height">
                    <h3>
                    <i className={`fa + ${this.props.fa}`} style={faStyle}></i>
                    {this.props.title}
                    </h3>
                    {this.props.children}
                </section>
                </LoadingOverlay>
            </section>
        )
    }
}

export default Content;