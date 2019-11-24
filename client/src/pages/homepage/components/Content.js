import React, {useContext, useState} from 'react' 
import {Avatar, Card, Input, Button, Checkbox, Icon, Dropdown, Menu, Tooltip} from 'antd'
import "./Content.scss"
import AppContext from '../../../Appcontext'
import AddContactModal from './content/chatboxlist/AddContactModal'
import ChatboxList from './content/chatboxlist/ChatboxList'
import ChatBody from './content/chatbody/ChatBody'
import Description from './content/description/Description'

const {Meta} = Card
const { TextArea } = Input

const Content = () => {
    const context = useContext(AppContext)
    const myUser = context.user 
    return (
        <div className="content">
            <ChatboxList></ChatboxList>
            <ChatBody></ChatBody>
            <Description></Description>
        </div>
    )
}

export default Content 