import React, {Component} from 'react'

class ModalBox extends Component {
    constructor(props)
    {
        super(props)
        this.onClose = this.onClose.bind(this)
        this.onSubmit = this.onSubmit.bind(this)
    }

    onClose = e => {
        this.props.onClose()
    };

    onSubmit = () => {
        this.props.onSubmit()
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
                        <button type="button" className={rightBtnClass} onClick={this.onSubmit}>{this.props.rightBtnText}</button>
                    </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ModalBox;