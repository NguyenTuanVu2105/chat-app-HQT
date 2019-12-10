import React, { useState, useContext, useEffect} from 'react'
import {Avatar, Card, Input, Button, Checkbox, Icon, Dropdown, Menu, Tooltip, message} from 'antd'
import { createAuthApi } from '../../../../../helper/auth'
import Appcontext from '../../../../../context/Appcontext'
import {socket} from '../../../../../helper/socket'

const ChatBody = (props) => {
    const context = useContext(Appcontext)
    const myUser = context.user
    const {rooms, getRoom} = context
    const {roomid} = props
    let room = rooms.find(room => JSON.stringify(room.id) === JSON.stringify(roomid))
    const [value, setValue] = useState('')
    const [reset, setReset] = useState(false)
    const [check, setCheck] = useState(true)

    const [listMessage, setListMessage] = useState([])
    const _fetchMessage = async () => {
        if (roomid){
            const data = await createAuthApi({url: `/api/room/messages?roomid=${roomid}`, method:'get'})
            setListMessage(listMessage => data)
        }
    }
    const handleChange = (e) => {
        if (reset) {
            setValue('')
            setReset(false)
        } else {
            setValue(e.target.value)
        }
    }

    useEffect(() => {
        var chat = document.getElementById('message-box')
        if (chat)
            chat.scrollTop = chat.scrollHeight
    })
    const handleKeyPress = (e) => {
        if(check) {
            var keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode === 13) {
                sendMessage()
                setReset(true)
            }
        }
    }

    const readMessage = async (roomid) => {
        const data = await createAuthApi({url: `/api/room/read?roomid=${roomid}`, method: 'get'})
    }

    useEffect(()=> {
        if (roomid) {
            socket.on(`send message`, function(data) {
                _fetchMessage()
                if (JSON.stringify(data.roomid) === JSON.stringify(roomid)) {
                    readMessage(roomid)
                    getRoom()
                }
            })
        }
    }, [roomid])

    useEffect(()=> {
        _fetchMessage()
    }, [roomid])
    
    const handleSendChange = () => {
        setCheck(!check)
    }

    const sendMessage = () => {
        console.log(value)
        socket.emit('client send message', {
            roomid: roomid,
            userid: myUser.id,
            message: value
        })
        setValue(value => '')
    }
    const { TextArea } = Input
    return (
      <div className="message-wrap">
        {
            roomid && (
                <div style={{width: '100%', height: '100%'}}>
                <div className="message-box" id="message-box">
                <div className="timeline-header">
                    <div className="timeline-date">
                        <div className="timeline-body">6/9/2019</div>
                    </div>
                </div>
                {
                    listMessage.map(message => (
                        <div className="message-chat-row">
                        <Avatar src={message.author.avatar}></Avatar>
                        <div className="message-content">
                            <div className="message-title">{message.author.name}</div>
                            <pre className="message-content-body">{message.content}</pre>
                        </div>
                        <div className="message-time">
                            {message.update_at.toString()}
                        </div>
                    </div>
                    ))
                }
            </div>
            <div className="message-send-box">
                <div style={{border: "1px solid #c5c5c5"}}>
                    <div className="message-send-top">                     
                        <Checkbox checked={check} onChange={handleSendChange}>Nhấn Enter để gửi</Checkbox>
                        <Button type="primary" onClick={sendMessage} style={{marginLeft: "10px", borderRadius:0}}>Send</Button>
                    </div>
                    <TextArea rows={4} 
                    onChange={handleChange} 
                    value={value} 
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn của bạn ở đây" 
                    style={{borderRadius:0}}></TextArea>
                </div>
            </div>
            </div>
            )
        }
                  
      </div>  
    )
}

export default ChatBody