import React, {Component} from 'react'
import log from 'loglevel';
import remote from 'loglevel-plugin-remote';
import * as CONSTS from '../../consts'

export default class Logger extends Component {
    constructor(props){
        super(props)
        remote.apply(log, { format: CONSTS.customJSON, url: CONSTS.logger_url });
        log.enableAll();
        this.log_msg = this.log_msg.bind(this)
    }

    componentDidMount() {
        if(this.props.level == "warn") log.warn(this.props.msg)
    }
}