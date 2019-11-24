import React, { useState, useContext } from 'react'
import AppContext from '../../../../../Appcontext' 
import {Avatar, Icon, Dropdown, Menu, Tooltip} from 'antd'
import className from 'classnames'
import {users} from '../../../../../data/user'
import AddContactModal from './AddContactModal'

const ChatboxList = (props) => {
    const context = useContext(AppContext)
    const myUser = context.user 
    const [currentInbox, setCurrentInbox] = useState(myUser.username)
    const [contactVisible, setContactVisible] = useState(false)

    // add contact modal 
    const addRoomMenu = (
        <Menu>
          <Menu.Item key="0">
            <div onClick={() => setContactVisible(true)}>Tạo nhóm trò chuyện</div>
          </Menu.Item>
          <Menu.Item key="1">
            <div>Thêm liên lạc</div>
          </Menu.Item>
        </Menu>
      );
    return (
        <ul className="list-chat">
        <li className="my-chat-btn" style={{backgroundColor: 'white'}}>
            <Tooltip placement="bottomLeft" title="Mở my chat">
                <Icon type="home" style={{fontSize:'25px', cursor:'pointer'}} theme='filled'></Icon>
            </Tooltip>
            <Dropdown overlay={addRoomMenu} trigger={['click']}>
                <Icon type="plus" style={{fontSize:'25px', cursor:'pointer'}}></Icon>
            </Dropdown>
        </li>
        <li name={myUser.username} className={className({'chat-box': true, 'current-chat-box': myUser.username === currentInbox})}>
                <Avatar src={myUser.avatar}></Avatar>
                    &nbsp; &nbsp; My chat
                </li>
        {
            users.map(user => (
                <li id = {user.id} className={className({'chat-box': true, 'current-chat-box': user.id === currentInbox})}>
                <Avatar src={user.avatar}></Avatar>
                    &nbsp; &nbsp; {user.name}
                </li>
            ))
        }
        <AddContactModal
            visible = {contactVisible}
            setVisible = {setContactVisible}
        >
        </AddContactModal>
    </ul>
    )
}

export default ChatboxList