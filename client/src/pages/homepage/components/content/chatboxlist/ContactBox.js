import React, { useState, useEffect, useContext} from 'react'
import {Avatar, Button} from 'antd'
import {socket} from '../../../../../helper/socket'
import AppContext from '../../../../../context/Appcontext' 

const ContactBox = (props) => {
    const {user, setCurrentUser, handleAddContact} = props
    const context = useContext(AppContext)
    const myUser = context.user 

    return (
        <div className="chat-box-contact">
            <div className="chat-box-cell" style={{display:'flex', padding:'10px'}} onClick={() => setCurrentUser(user)}>
                <Avatar src={user.avatar}></Avatar>
                <p>{user.name}</p>
            </div>
            <div style={{width:'100%', padding:"10px 0", display:'flex', justifyContent:'center', border:'1px solid #e6e6e6', background:'#dedede'}}>
                <Button type="primary" style={{width:'150px'}} onClick={()=>handleAddContact(user)}>Thêm liên lạc</Button>
            </div>
        </div>
    )
}

export default ContactBox