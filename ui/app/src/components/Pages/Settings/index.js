import React, { useState, useEffect } from 'react';
import Header from '../../Header'
import Menu from '../../Menu'
import Content from '../../Content'
import Row from '../../Row'
import Col from '../../Col'
import UsersPanel,{InitSystemPanel} from './Panel'
import ModalBox from '../../ModalBox'
import Cookies from 'js-cookie';

function SettingsPage() {

    const [modelOpen, toggleModel] = useState({modalStatus: false, blackBackground: "none"})
    useEffect(() => {
        (modelOpen.modalStatus) ? console.log("Open") : console.log("Close")
    })

    function onConfirmDeletion() {
        const url="http://localhost:3002/system/init"
        fetch(url, {
            method: 'POST',
            body: JSON.stringify({"token":Cookies.get('token')}),
            headers: {
              'Content-Type': 'application/json'
            }
          })
        .then(res => {
            toggleModel({modalStatus: false, blackBackground: "none"})
        })
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
                <Row className="row mt">
                    <Col className="col-md-12">
                        <InitSystemPanel title="Initilize System" onClick={()=>toggleModel({modalStatus: true, blackBackground: "block"})}>
                            Test
                        </InitSystemPanel>
                    </Col>
                </Row>
            </Content>
            <ModalBox 
                show={modelOpen.modalStatus} 
                title="Are you sure? All the data will be lost"
                onClose={()=>toggleModel({modalStatus: false, blackBackground: "none"})}
                rightBtnText="Confirm"
                onSubmit={onConfirmDeletion}
                type="danger"
                >
            </ModalBox>
            <div className="modal-backdrop fade in" style={{display: modelOpen.blackBackground}}></div>
        </React.Fragment>
    )
}

export default SettingsPage;