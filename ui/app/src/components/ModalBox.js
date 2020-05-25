import React, {Component} from 'react'

class ModalBox extends Component {
    constructor(props)
    {
        super(props)
        this.state = {
            full_name: '',
            username: '',
            password: '',
            email: '',
            role: 'Admin'
        }
        this.onClose = this.onClose.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onClose = e => {
        this.props.onClose()
    };

    onSubmit = () => {
        this.props.onSubmit(this.props.type, this.state.full_name, this.state.email, this.state.username, this.state.password, this.state.role)
    }

    render(){
        if(!this.props.show)
            return null
        var rightBtnClass ="btn"
        var headerColor = "#f0ad4e"
        if(this.props.type === "warning"){
            rightBtnClass="btn btn-warning"
            headerColor="#f0ad4e"
        }
        if(this.props.type === "danger") {
            rightBtnClass="btn btn-danger"
            headerColor="#d9534f"
        }
        if(this.props.type === "success") {
            rightBtnClass="btn btn-success"
            headerColor="#28a745"
        }
        if(this.props.type === "edit_user") {
            rightBtnClass="btn btn-success"
            headerColor="#28a745"
            return(
                <div className="modal fade in" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" style={{display: "block", paddingRight: "17px"}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header" style={{backgroundColor: headerColor}}>
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={e=> { this.onClose(e)}}>×</button>
                            <h4 className="modal-title" id="modalLabel">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            <form role="form" className="form-horizontal style-form">
                                <div className="form-group">
                                <label className="col-lg-2 control-label">Full Name</label>
                                <div className="col-lg-10">
                                    <input value={this.state.full_name} onChange={(e) => this.setState({full_name: e.target.value})} type="text" placeholder="" id="f-name" className="form-control" />
                                    {/* <p className="help-block">Successfully done</p> */}
                                </div>
                                </div>
                                <div className="form-group">
                                <label className="col-lg-2 control-label">Email</label>
                                <div className="col-lg-10">
                                    <input type="email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} placeholder="" id="l-name" className="form-control" />
                                    {/* <p className="help-block">Aha you gave a wrong info</p> */}
                                </div>
                                </div>
                                <div className="form-group">
                                <label className="col-lg-2 control-label">Username</label>
                                <div className="col-lg-10">
                                    <input type="text" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} placeholder="" id="username" className="form-control" />
                                    {/* <p className="help-block">Something went wrong</p> */}
                                </div>
                                </div>
                                <div className="form-group">
                                <label className="col-lg-2 control-label">Password</label>
                                <div className="col-lg-10">
                                    <input type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} placeholder="" id="password" className="form-control" />
                                    {/* <p className="help-block">Something went wrong</p> */}
                                </div>
                                </div>
                                <div className="form-group">
                                <label className="col-lg-2 control-label">Role</label>
                                <div className="col-lg-10">
                                    <select value={this.state.role} onChange={(e) => this.setState({role: e.target.value})} className="form-control">
                                    <option>Admin</option>
                                    <option>Analyst</option>
                                    <option>Reasercher</option>
                                    </select>
                                    {/* <p className="help-block">Something went wrong</p> */}
                                </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={e=> { this.onClose(e)}}>Close</button>
                            {(this.props.type === "success") ? '' : <button type="button" className={rightBtnClass} onClick={this.onSubmit}>{this.props.rightBtnText}</button>}
                        </div>
                        </div>
                    </div>
                </div>
            )
        }
        else if(this.props.type === "add_user") {
            rightBtnClass="btn btn-success"
            headerColor="#28a745"
            return(
                <div className="modal fade in" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" style={{display: "block", paddingRight: "17px"}}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header" style={{backgroundColor: headerColor}}>
                            <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={e=> { this.onClose(e)}}>×</button>
                            <h4 className="modal-title" id="modalLabel">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            <form role="form" className="form-horizontal style-form">
                                <div className="form-group">
                                <label className="col-lg-2 control-label">Full Name</label>
                                <div className="col-lg-10">
                                    <input value={this.state.full_name} onChange={(e) => this.setState({full_name: e.target.value})} type="text" placeholder="" id="f-name" className="form-control" />
                                    {/* <p className="help-block">Successfully done</p> */}
                                </div>
                                </div>
                                <div className="form-group">
                                <label className="col-lg-2 control-label">Email</label>
                                <div className="col-lg-10">
                                    <input type="email" value={this.state.email} onChange={(e) => this.setState({email: e.target.value})} placeholder="" id="l-name" className="form-control" />
                                    {/* <p className="help-block">Aha you gave a wrong info</p> */}
                                </div>
                                </div>
                                <div className="form-group">
                                <label className="col-lg-2 control-label">Username</label>
                                <div className="col-lg-10">
                                    <input type="text" value={this.state.username} onChange={(e) => this.setState({username: e.target.value})} placeholder="" id="username" className="form-control" />
                                    {/* <p className="help-block">Something went wrong</p> */}
                                </div>
                                </div>
                                <div className="form-group">
                                <label className="col-lg-2 control-label">Password</label>
                                <div className="col-lg-10">
                                    <input type="password" value={this.state.password} onChange={(e) => this.setState({password: e.target.value})} placeholder="" id="password" className="form-control" />
                                    {/* <p className="help-block">Something went wrong</p> */}
                                </div>
                                </div>
                                <div className="form-group">
                                <label className="col-lg-2 control-label">Role</label>
                                <div className="col-lg-10">
                                    <select value={this.state.role} onChange={(e) => this.setState({role: e.target.value})} className="form-control">
                                    <option>Admin</option>
                                    <option>Analyst</option>
                                    <option>Reasercher</option>
                                    </select>
                                    {/* <p className="help-block">Something went wrong</p> */}
                                </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={e=> { this.onClose(e)}}>Close</button>
                            {(this.props.type === "success") ? '' : <button type="button" className={rightBtnClass} onClick={this.onSubmit}>{this.props.rightBtnText}</button>}
                        </div>
                        </div>
                    </div>
                </div>
            )
        } else {
        return(
            <div className="modal fade in" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="modalLabel" aria-hidden="true" style={{display: "block", paddingRight: "17px"}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header" style={{backgroundColor: headerColor}}>
                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true" onClick={e=> { this.onClose(e)}}>×</button>
                        <h4 className="modal-title" id="modalLabel">{this.props.title}</h4>
                    </div>
                    <div className="modal-body">
                        {this.props.children}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal" onClick={e=> { this.onClose(e)}}>Close</button>
                        {(this.props.type === "success") ? '' : <button type="button" className={rightBtnClass} onClick={this.onSubmit}>{this.props.rightBtnText}</button>}
                    </div>
                    </div>
                </div>
            </div>
        )
      }
    }
}

export default ModalBox;