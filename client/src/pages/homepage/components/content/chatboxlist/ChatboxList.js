import React, { useState, useContext, useEffect } from 'react'
import AppContext from '../../../../../context/Appcontext' 
import {Avatar, Icon, Dropdown, Menu, Tooltip} from 'antd'
import className from 'classnames'
import {createAuthApi} from '../../../../../helper/auth'
import AddGroupModal from './AddGroupModal'

const ChatboxList = (props) => {
    const context = useContext(AppContext)
    const myUser = context.user 
    const {rooms, setRooms, getStatus} = context
    const {currentRoom, setCurrentRoom} = props
    const [addGroupVisible, setAddGroupVisible] = useState(false)
    // add contact modal 
    const addRoomMenu = (
        <Menu>
          <Menu.Item key="0">
            <div onClick={() => setAddGroupVisible(true)}>Tạo nhóm trò chuyện</div>
          </Menu.Item>
          <Menu.Item key="1">
            <div onClick={() =>  context.setContactVisible(true)}>Thêm liên lạc</div>
          </Menu.Item>
        </Menu>
      );
    const readMessage = async (roomid) => {
        const x = rooms.find(room => JSON.stringify(room.id) === JSON.stringify(roomid))
        x.read = true
        setRooms(room => rooms)
        const data = await createAuthApi({url: `/api/room/read?roomid=${roomid}`, method: 'get'})
        console.log(data)
    }

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
        <div className="chat-box-list">
        {
            rooms.map((room, index) => (
                <li id = {room.id} key={index}  
                    onClick ={()=>{
                        setCurrentRoom(room.id)
                        readMessage(room.id)
                    }} 
                    className={className({'chat-box': true, 
                    'current-chat-box': JSON.stringify(room.id) === JSON.stringify(currentRoom),
                    'unread-chat-box': !room.read})}>
                <Avatar src={room.avatar}></Avatar>
                    &nbsp; &nbsp; {room.name}
                </li>
            ))
        }
        </div>
        <AddGroupModal visible={addGroupVisible} setVisible={setAddGroupVisible} setCurrentRoom={setCurrentRoom}></AddGroupModal>
    </ul>
    )
}

export default ChatboxList