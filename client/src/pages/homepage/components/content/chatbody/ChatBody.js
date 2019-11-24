import React, { useState } from 'react'
import {Avatar, Card, Input, Button, Checkbox, Icon, Dropdown, Menu, Tooltip} from 'antd'

const ChatBody = (props) => {
    const { TextArea } = Input
    return (
        <div className="message-wrap">
        <div className="message-box">
            <div className="timeline-header">
                <div className="timeline-date">
                    <div className="timeline-body">6/9/2019</div>
                </div>
            </div>
            <div className="message-chat-row">
                <Avatar src="http://thuthuatphanmem.vn/uploads/2018/06/18/anh-avatar-dep-42_034122099.jpg"></Avatar>
                <div className="message-content">
                    <div className="message-title">Nguyen Tuan Vu</div>
                    <pre className="message-content-body">Hello everybody</pre>
                </div>
                <div className="message-time">
                    12:00
                </div>
            </div>

            <div className="message-chat-row">
                <Avatar src="https://i.pinimg.com/originals/58/1c/5e/581c5ec4c434e4918198fc8be1c13f95.jpg"></Avatar>
                <div className="message-content">
                    <div className="message-title">Nguyen Thi Quy Anh</div>
                    <pre className="message-content-body">Hi there</pre>
                </div>
                <div className="message-time">
                    12:00
                </div>
            </div>
        </div>
        <div className="message-send-box">
            <div style={{border: "1px solid #e6e6e6"}}>
                <div className="message-send-top">                     
                    <Checkbox>Nhấn Enter để gửi</Checkbox>
                    <Button type="primary" style={{marginLeft: "10px", borderRadius:0}}>Send</Button>
                </div>
                <TextArea rows={4} placeholder="Nhập tin nhắn của bạn ở đây" style={{borderRadius:0}}></TextArea>
            </div>
        </div>
    </div>
    )
}

export default ChatBody