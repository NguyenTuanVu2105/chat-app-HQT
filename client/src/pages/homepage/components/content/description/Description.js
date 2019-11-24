import React, { useState } from 'react'
import {Button, Icon} from 'antd'

const Description = (props) => {
    return (
        <div className="description-box">
        <div className="description">
            <div className="chat-tool"></div>
            <div className="description-header">
                Mô tả
                <Icon type="edit" className="button-edit"/>
            </div>
            <pre className="description-content">Đây là group dùng để test</pre>
        </div>
        <div className="note">
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
        </div>
    </div>
    )
}

export default Description