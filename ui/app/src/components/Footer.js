import React, { Component } from 'react'

class Footer extends Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <footer className="site-footer">
                <div className="text-center">
                    <p>
                    © Copyrights <strong>Dashio</strong>. All Rights Reserved
                    </p>
                    <div className="credits">
                    {/* <!--
                        You are NOT allowed to delete the credit link to TemplateMag with free version.
                        You can delete the credit link only if you bought the pro version.
                        Buy the pro version with working PHP/AJAX contact form: https://templatemag.com/dashio-bootstrap-admin-template/
                        Licensing information: https://templatemag.com/license/
                    --> */}
                    Created with Dashio template by <a href="https://templatemag.com/">TemplateMag</a>
                    </div>
                    <a href="blank.html#" className="go-top">
                    <i className="fa fa-angle-up"></i>
                    </a>
                </div>
            </footer>
        )
    }
}

export default Footer;