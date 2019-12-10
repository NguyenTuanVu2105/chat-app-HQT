import React, {useContext, useState, useEffect} from 'react' 
import {Avatar, Card, Input, Button, Checkbox, Icon, Dropdown, Menu, Tooltip} from 'antd'
import "./Content.scss"
import AppContext from '../../../context/Appcontext'
import AddContactModal from './content/chatboxlist/AddContactModal'
import ChatboxList from './content/chatboxlist/ChatboxList'
import ChatBody from './content/chatbody/ChatBody'
import Description from './content/description/Description'


const Content = () => {
    const context = useContext(AppContext)
    const myUser = context.user 
    const {rooms} = context
    const [currentRoom, setCurrentRoom] = useState(null)
    useEffect(() => {
        console.log(rooms)
        if (rooms.length){
            // console.log(rooms[0].id)
            // setCurrentRoom(rooms[0].id)
        }
    }, [myUser])
    return (
        <div className="content">
            <ChatboxList currentRoom={currentRoom} setCurrentRoom={setCurrentRoom}></ChatboxList>
            <ChatBody roomid={currentRoom}></ChatBody>
            <Description room={currentRoom}></Description>
        </div>
    )
}

export default Content 