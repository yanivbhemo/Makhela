import React, { useState, useEffect } from 'react';
import Header from '../../Header'
import Menu from '../../Menu'
import Content from '../../Content'
import Row from '../../Row'
import Col from '../../Col'
import UsersPanel,{InitSystemPanel, ThresholdPanel, SettingItem, KeywordPanel, KeywordItem} from './Panel'
import ModalBox from '../../ModalBox'
import Cookies from 'js-cookie';
import * as CONSTS from '../../../consts'

function SettingsPage(props) {

    const [modelOpen, toggleModel] = useState({modalStatus: false, blackBackground: "none", modalType: '', modalText:''})

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
            body: JSON.stringify({"token":Cookies.get('token'), word:word}),
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
    
    return(
        <React.Fragment>
            <Header />
            <Menu />
            <Content title="Settings" fa="fa-cogs" loadingActive={false}>
                <Row className="row mt">
                    <Col className="col-md-12">
                        <UsersPanel title="Users" fa="users">
                            Test
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
                        <InitSystemPanel title="Initilize System" onClick={()=>toggleModel({modalStatus: true, blackBackground: "block", modalType: 'danger', modalText:'Are you sure? All data will be lost'})}>
                            Test
                        </InitSystemPanel>
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
            <div className="modal-backdrop fade in" style={{display: modelOpen.blackBackground}}></div>
        </React.Fragment>
    )
}

export default SettingsPage;