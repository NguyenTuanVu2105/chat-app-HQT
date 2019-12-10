import React, { useState, useContext } from 'react'
import {Button, Icon} from 'antd'
import Appcontext from '../../../../../context/Appcontext'

const Description = (props) => {
    const context = useContext(Appcontext)
    const myUser = context.user
    const {rooms} = context
    let room = rooms.find(room => JSON.stringify(room.id) === JSON.stringify(props.room))
    return (
        <div className="description-box">
        <div className="description">
            <div className="chat-tool"></div>
            <div className="description-header">
                Mô tả
                <Icon type="edit" className="button-edit"/>
            </div>
        <pre className="description-content">
            {room ? room.description:'' }
            </pre>
        </div>
        {/* <div className="note">
            <div className="description-header">
                Ghi chú
                <Icon type="edit" className="button-edit"/>
            </div>
            <pre className="description-content">Mỗi ngày mới là một niềm vui</pre>
        </div>
        <div className="task">
            <div className="description-header">
                Tasks
                <Icon type="edit" className="button-edit"/>
            </div>
            <div className="description-task">
                <Button type="primary" style={{width: "100%"}}>Thêm công việc</Button>

            </div>
        </div> */}
    </div>
    )
}

export default Description