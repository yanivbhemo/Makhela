import React, { useState, useEffect } from 'react';

const panelHeadingStyle={
    paddingBottom: "30px"
}

function UsersPanel(props) {
    const title_fa = "fa fa-" + props.fa

    return(
        <div className="task-panel tasks-widget">
              <div className="panel-heading" style={panelHeadingStyle}>
                <div className="pull-left">
                  <h4><i className={title_fa}></i> {props.title}</h4>
                </div>
              </div>
              <div className="panel-body">
                <div className="task-content">
                  <ul className="task-list">
                    <li>
                      <div className="task-title">
                        <span className="task-title-sp">root</span>
                        <div className="pull-left hidden-phone">
                          <button className="btn btn-primary btn-xs" data-toggle="modal" data-target="#editUserModal"><i className="fa fa-pencil"></i></button>                        </div>
                        <div className="pull-right">
                          <b>root</b>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="add-task-row">
                  <button className="btn btn-success btn-sm pull-left" data-toggle="modal" data-target="#myModal">
                    Add New User
                  </button>
                </div>
              </div>
            </div>
    )
}

export function InitSystemPanel(props) {

    return(
        <div className="task-panel tasks-widget">
              <div className="panel-heading" style={panelHeadingStyle}>
                <div className="pull-left">
                  <h4><i className="fa fa-remove"></i> {props.title}</h4>
                </div>
              </div>
              <div className="panel-body">
                <div className="add-task-row">
                  <button className="btn btn-danger btn-sm pull-left" onClick={props.onClick}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
    )
}

export function ThresholdPanel(props) {

  return(
      <div className="task-panel tasks-widget">
            <div className="panel-heading" style={panelHeadingStyle}>
              <div className="pull-left">
                <h4><i className="fa fa-tasks"></i> {props.title}</h4>
              </div>
            </div>
            <div className="panel-body">
              <div className="task-content">
                <ul className="task-list">
                  {props.children}
                </ul>
              </div>
            </div>
          </div>
  )
}

export function SettingItem(props) {
  const [settingValue, setSettingValue] = useState(props.value)

  function onClickHandle() {
    props.onBtnClick(props.attribute, settingValue)
  }
  return(
                   <li>
                      <div className="task-title">
                        <span className="task-title-sp">{props.attribute}</span>
                        <div className="pull-right hidden-phone">
                          <button className="btn btn-success btn-xs" onClick={onClickHandle}><i className="fa fa-check"></i></button>
                        </div>
                        <div className="pull-right">
                          <input onChange={(e)=>setSettingValue(e.target.value)} type="text" className="centered" defaultValue={props.value} name={`input_${props.attribute}`} />
                        </div>
                      </div>
                  </li>
  )
}

export default UsersPanel;