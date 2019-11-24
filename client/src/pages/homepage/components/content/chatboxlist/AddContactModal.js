import React, { useState } from 'react'
import { Modal, Button, Tabs, Input} from 'antd';
import axios from 'axios'

const {Search} = Input
const {TabPane} = Tabs
const AddContactModal = (props) => {
    const {visible, setVisible} = props
    const [users, setUsers] = useState([])
    const handleCancel = () => {
        setVisible(false)
    }

    const handleSearch = (value) => {
        const data = {
            query: value
        }
        axios.post("http://localhost:5000/api/users/search", data)
            .then(res => {
                setUsers(res.data)
            })
    }
    
    return(
        <Modal
        visible={visible}
        title="Title"
        onCancel={handleCancel}
        className="contact-modal"
        footer={<div>ad</div>}
        width={1000}
      >
        <Tabs defaultActiveKey="1" size="small">
          <TabPane tab="Tìm kiếm liên lạc" key="1">
            <div className="header">
            <Search
                placeholder="Tìm kiếm user bằng tên hoặc email"
                onSearch={handleSearch}
                style={{ width: 400 }}
                size="small"
            />
            </div>
            <div className="user-search-body">
                <div className="user-box-list"></div>
                {
                    users.map(user => (
                        <div key={user.username} className="user-box">
                            {user.fullname}
                        </div>
                    ))
                }
            </div>
          </TabPane>
          <TabPane tab=" Contact" key="2">
           
          </TabPane>
        </Tabs>
      </Modal>
    )
}

export default AddContactModal