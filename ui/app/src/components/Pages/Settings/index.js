import React, { useState, useEffect } from 'react';
import Header from '../../Header'
import Menu from '../../Menu'
import Content from '../../Content'
import Row from '../../Row'
import Col from '../../Col'
import UsersPanel,{UserItem, InitSystemPanel, ThresholdPanel, SettingItem, KeywordPanel, KeywordItem} from './Panel'
import ModalBox from '../../ModalBox'
import Cookies from 'js-cookie';
import * as CONSTS from '../../../consts'

function SettingsPage(props) {
    const [modelDeleteUser, toggleDelModel] = useState({modalStatus: false, blackBackground: "none", modalType: 'danger', modalText:'You are about to delete a user'})
    const [modelAddUser, toggleAddModel] = useState({modalStatus: false, blackBackground: "none", modalType: 'add_user', modalText:'Add new user'})
    const [modelEditUser, toggleEditModel] = useState({modalStatus: false, blackBackground: "none", modalType: 'edit_user', modalText:'Edit user'})

    const [users, setUsers] = useState([])
    useEffect(() => {
        const url = CONSTS.GET_ALL_USERS
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({"token":Cookies.get('token')}),
                headers: {
                  'Content-Type': 'application/json'
                }
              })
            .then(res => res.json())
              .then(data => {
                  setUsers(data)
              })
              .catch(err => console.log(err))
            .catch(err => console.log(err))
    }, [])

    function eachUser(user, id){
        return(
            <UserItem 
                key={`user${id}`}
                username={user.username}
                email={user.email}
                full_name={user.full_name}
                password={user.password}
                role={user.role}
                onDeleteBtn={deleteUser}
                onEditBtn={editUser}
            />
        )
    }

    function deleteUser(email){
        toggleDelModel({...modelDeleteUser, modalStatus: true, blackBackground: "block", email: email})
    }

    function deleteUserSubmit(){
        const email = modelDeleteUser.email
        const url = CONSTS.DELETE_USER
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({"token":Cookies.get('token'), email: email}),
                headers: {
                  'Content-Type': 'application/json'
                }
              })
            .then(res => {
                if(res.status === 200){
                    setUsers(users.filter(item => item.email !== email))
                    toggleDelModel({...modelDeleteUser, modalStatus: false, blackBackground: "none"})
                }
            })
            .catch(err => console.log(err))
    }

    function editUser(full_name, email, username, password, role){
        console.log(full_name, email, username, password, role)
        toggleEditModel({...modelEditUser, modalStatus: true, blackBackground: "block", full_name:full_name, email:email, username:username, password:password, role:role})
        
    }

    const [modelOpen, toggleModel] = useState({modalStatus: false, blackBackground: "none", modalType: '', modalText:'', submit: ''})
    function onConfirmDeletion() {
        const url = CONSTS.FORMAT_SYSTEM
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res => {
            if(res.status === 200){
                props.history.push('/initiation')
            }
            else alert('Init did not succeeded')
        })
    }

    const [settings, setSettings] = useState([])
    useEffect(() => {
        const url = CONSTS.GET_ALL_SYSTEMS_SETTINGS
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({"token":Cookies.get('token')}),
                headers: {
                  'Content-Type': 'application/json'
                }
              })
            .then(res => res.json())
              .then(data => {
                  setSettings(data)
              })
              .catch(err => console.log(err))
            .catch(err => console.log(err))
    }, [])

    function eachSetting(setting, id) {
        return(
            <SettingItem 
                key={`setting${id}`}
                attribute={setting.attribute}
                value={setting.value}
                onBtnClick={saveSetting}
                setting_id={setting._id}
            />
        )
    }

    const [keywords, setKeywords] = useState([])
    useEffect(() => {
        const url = CONSTS.GET_ALL_KEYWORDS
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
            .then(data => {
                setKeywords(data)
            })
            .catch(err => console.log(err))
        .catch(err => console.log(err))
    }, [])

    function eachKeyword(keyword, id) {
        return(
            <KeywordItem
                key={`keyword${id}`}
                word={keyword.word}
                onDltBtnClick={deleteKeyword}
            />
        )
    }

    function deleteKeyword(word)
    {
        const url = CONSTS.DELETE_KEYWORD
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token'), word: word}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res => {
            if(res.status === 200) {
                toggleModel({modalStatus: true, blackBackground: "block", modalType: 'success', modalText:'Changes Saved Successfuly'})
                setKeywords(keywords.filter(item => item.word !== word))
            }
        })
        .catch(err => console.log(err))
    }

    function saveSetting(attribute, value)
    {
        const url = CONSTS.UPDATE_SETTING
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token'), attribute: attribute, value: value}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res => {
            if(res.status === 200) {
                toggleModel({modalStatus: true, blackBackground: "block", modalType: 'success', modalText:'Changes Saved Successfuly'})
            }
        })
        .catch(err => console.log(err))
    }

    function addKeyword(word)
    {
        const url = CONSTS.ADD_KEYWORD
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token'), word: word}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res => {
            if(res.status === 200) {
                toggleModel({modalStatus: true, blackBackground: "block", modalType: 'success', modalText:'Keyword "' + word + '" Added successfuly'})
            }
        })
        .catch(err => console.log(err))
    }

    function onSubmitAddUser(type, full_name, email, username, password, role) {
        if(type === "add_user"){
            const url = CONSTS.ADD_USER
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({"token":Cookies.get('token'), full_name:full_name, email:email, username:username, password:password, role:role}),
                headers: {
                'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(res.status === 200) {
                    var newUsers = users
                    newUsers.push({full_name, email, username, password, role})
                    setUsers(newUsers)
                    toggleAddModel({...modelAddUser,modalStatus: false, blackBackground: "none"})
                } else {
                    alert("Email exist")
                }
            })
            .catch(err => console.log(err))
        } else {
            const url = CONSTS.EDIT_USER
            fetch(url, {
                method: 'POST',
                body: JSON.stringify({"token":Cookies.get('token'), full_name:full_name, email:email, username:username, password:password, role:role}),
                headers: {
                'Content-Type': 'application/json'
                }
            })
            .then(res => {
                if(res.status === 200) {
                    toggleEditModel({...modelEditUser,modalStatus: false, blackBackground: "none"})
                }
            })
            .catch(err => console.log(err))
        }
    }
    
    return(
        <React.Fragment>
            <Header />
            <Menu />
            <Content title="Settings" fa="fa-cogs" loadingActive={false}>
                <Row className="row mt">
                    <Col className="col-md-12">
                        <UsersPanel title="Users" fa="users" onAddClick={()=>toggleAddModel({...modelAddUser,modalStatus: true, blackBackground: "block"})}>
                            {users.map((item, i) => eachUser(item, i))}
                        </UsersPanel>
                    </Col>
                </Row>
                <Row className="row">
                    <Col className="col-md-12">
                        <ThresholdPanel 
                        title="Collector and Suggestions Thresholds"
                        >
                        {settings.map((item,i) => eachSetting(item, i))}
                        </ThresholdPanel>
                    </Col>
                </Row>
                <Row className="row">
                    <Col className="col-md-12">
                        <KeywordPanel title="Keywords To Search For" onAddClick={addKeyword}>
                            {keywords.map((item,i) => eachKeyword(item, i))}
                        </KeywordPanel>
                    </Col>
                </Row>
                <Row className="row">
                    <Col className="col-md-12">
                        <InitSystemPanel 
                        title="Initilize System" 
                        onClick={()=>toggleModel({modalStatus: true, blackBackground: "block", modalType: 'danger', modalText:'Are you sure? All data will be lost'})}
                        />
                            
                    </Col>
                </Row>
            </Content>
            <ModalBox 
                show={modelOpen.modalStatus} 
                title={modelOpen.modalText}
                onClose={()=>toggleModel({modalStatus: false, blackBackground: "none"})}
                rightBtnText="Confirm"
                onSubmit={onConfirmDeletion}
                type={modelOpen.modalType}
                >
            </ModalBox>
            <ModalBox 
                show={modelAddUser.modalStatus} 
                title={modelAddUser.modalText}
                onClose={()=>toggleAddModel({...modelAddUser, modalStatus: false, blackBackground: "none"})}
                rightBtnText="Confirm"
                onSubmit={onSubmitAddUser}
                type={modelAddUser.modalType}

                >
            </ModalBox>
            <ModalBox 
                show={modelDeleteUser.modalStatus} 
                title={modelDeleteUser.modalText}
                onClose={()=>toggleDelModel({modalStatus: false, blackBackground: "none"})}
                rightBtnText="Confirm"
                onSubmit={deleteUserSubmit}
                type={modelDeleteUser.modalType}
                >
            </ModalBox>
            <ModalBox 
                show={modelEditUser.modalStatus} 
                title={modelEditUser.modalText}
                onClose={()=>toggleEditModel({...modelEditUser,modalStatus: false, blackBackground: "none"})}
                rightBtnText="Edit"
                onSubmit={onSubmitAddUser}
                type={modelEditUser.modalType}
                full_name={modelEditUser.full_name}
                email={modelEditUser.email}
                username={modelEditUser.username}
                password={modelEditUser.password}
                role={modelEditUser.role}
                >
            </ModalBox>
            <div className="modal-backdrop fade in" style={{display: modelOpen.blackBackground}}></div>
            <div className="modal-backdrop fade in" style={{display: modelAddUser.blackBackground}}></div>
            <div className="modal-backdrop fade in" style={{display: modelDeleteUser.blackBackground}}></div>
            <div className="modal-backdrop fade in" style={{display: modelEditUser.blackBackground}}></div>
        </React.Fragment>
    )
}

export default SettingsPage;