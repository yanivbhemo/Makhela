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
                    {props.children}
                  </ul>
                </div>
                <div className="add-task-row">
                  <button className="btn btn-success btn-sm pull-left" data-toggle="modal" data-target="#myModal" onClick={props.onAddClick}>
                    Add New User
                  </button>
                </div>
              </div>
            </div>
    )
}

export function UserItem(props) {
  function handleDeleteBtn(){
    props.onDeleteBtn(props.email)
  }

  function handleEditBtn(){
    props.onEditBtn(props.full_name,props.email,props.username,props.password,props.role)
  }

  if(props.username === "root") {
    return(
                      <li>
                        <div className="task-title">
                          <span className="task-title-sp">{props.username}</span>
                          <div className="pull-left hidden-phone">
                            <button style={{display: "none"}}onClick={handleEditBtn} className="btn btn-primary btn-xs" data-toggle="modal" data-target="#editUserModal"><i className="fa fa-pencil"></i></button>
                          </div>
                          <div className="pull-right">
                            <b>{props.role}</b>
                          </div>
                        </div>
                      </li>
    )
  } else {
    return (
                    <li>
                      <div className="task-title">
                        <span className="task-title-sp">{props.username}</span>
                        <div className="pull-left hidden-phone">
                          <button style={{display: "none"}} className="btn btn-primary btn-xs" onClick={handleEditBtn} data-toggle="modal" data-target="#editUserModal"><i className="fa fa-pencil"></i></button>
                          <button className="btn btn-danger btn-xs" onClick={handleDeleteBtn}><i className="fa fa-trash-o "></i></button>
                        </div>
                        <div className="pull-right">
                          <b>{props.role}</b>
                        </div>
                      </div>
                    </li>
    )
  }
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
              <div className="panel-footer">
                <h5><strong>Calculations:</strong></h5>
                <p>
                  <strong>New Suggestions :</strong> If certainty level >= 'AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY' <br />
                  <strong>Automatic addition of Opinion Leader :</strong> If certainty level > 'AFTER_RESOLVE_MAX_LEVEL_OF_CERTAINTY' <br/>
                </p>
                <strong>Suggestions Ranking Mechanism:</strong><br/>
                <ul>
                    <li>Description has 1 or more keywords += 'AFTER_RESOLVE_MID_LEVEL_OF_CERTAINTY'</li>
                    <li>'MIN_AMOUNT_OF_FOLLOWERS' <u>Lower than</u> Amount of followers <u>Lower than</u> MID_AMOUNT_OF_FOLLOWERS += 1</li>
                    <li>'MID_AMOUNT_OF_FOLLOWERS' <u>Lower than</u> Amount of followers <u>Lower than</u> MAX_AMOUNT_OF_FOLLOWERS += 2</li>
                    <li>'MIN_AMOUNT_OF_STATUSES' <u>Lower than</u> Amount of statuses += 1</li>
                    <li></li>
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

export function KeywordPanel(props) {

  const [keywordValue, setkeywordValue] = useState('')

  function onAddHandle() {
    props.onAddClick(keywordValue)
  }

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
              <div className="panel-footer">
                <h5>New keyword</h5>
                <div className="input-group bootstrap-timepicker">
                  <input type="text" onChange={(e)=>setkeywordValue(e.target.value)} className="form-control timepicker-default" />
                  <span className="input-group-btn">
                    <button className="btn btn-success" type="button" onClick={onAddHandle}><i className="fa fa-check"></i></button>
                  </span>
                </div>
              </div>
            </div>
          </div>
  )
}

export function KeywordItem(props) {
  function onClickHandle() {
    props.onDltBtnClick(props.word)
  }
  return(
    <span className="task-title-sp">
        <button type="button" className="btn btn-primary" style={{cursor: "default"}}>
          {props.word} <span className="badge badge-light" style={{cursor: "pointer"}} onClick={onClickHandle}>X</span>
        </button>
    </span>
  )
}

export default UsersPanel;