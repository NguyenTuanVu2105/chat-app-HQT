import React, { useState, useEffect, useContext, useRef } from 'react'
import { Modal, Button, Tabs, Input, Card, Badge, Avatar, Form, Divider, Checkbox, Icon} from 'antd';
import ContactBox from './ContactBox';
import './AddGroupModal.scss'
import {socket} from '../../../../../helper/socket'
import AppContext from '../../../../../context/Appcontext'
import { createAuthApi } from '../../../../../helper/auth';

const AddGroupModalWapper = (props) => {
    const context = useContext(AppContext)
    const myUser = context.user 
    const {contactVisible, setContactVisible, contacts, setContacts, getStatus, getRoom} = context
    const {visible, setVisible} = props
    const [value, setValue] = useState('')
    const form = useRef(null)
    const handleCancel = () => {
        props.form.resetFields()
        setVisible(false)
    }

    const handleChange = (e) => {
        // console.log(contacts.filter(contact => contact.name.includes(e.target.value)))
        setValue(e.target.value)
    }

    const addGroup = async (values) => {
        const {name, description, members} = values
        const data = await createAuthApi({url: '/api/room', method:'post', data: {name, description, members: [myUser.id, ...members]}})
        if (data.success) {
            props.form.resetFields()
            setVisible(false)
            getStatus()
            getRoom()
            socket.emit('new group', data.id, data.members)
        }
    }

    const handleSubmit = e => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
          if (!err) {
            addGroup(values)
          }
        });
      };
 
    const { getFieldDecorator } = props.form;
    return(
        <Modal
        visible={visible}
        title="Thêm nhóm chat"
        onCancel={handleCancel}
        className="contact-modal"
        footer={null}
        width={700}
      >
          <Form ref={form} onSubmit={handleSubmit}>
          <div>
              <div>
                  <div className="modal-input">
                      <strong className="modal-label">Tên nhóm</strong>
                      <Form.Item>
                          {getFieldDecorator('name', {
                              rules: [
                                { required: true, message: 'Please input group name'},
                              ]
                          })(<Input></Input>)}
                      </Form.Item>
                  </div>
                  <div className="modal-input">
                      <strong className="modal-label">Mô tả</strong>
                      <Form.Item>
                        {getFieldDecorator('description')(<Input.TextArea rows={3}></Input.TextArea>)}
                      </Form.Item>
                  </div>
              </div>
              <Divider></Divider>
              <div>
              <Input
                    placeholder="Tìm kiếm thành viên bằng tên"
                    onChange={handleChange}
                    value={value}
                    prefix={<Icon type="search" style={{ color: 'rgba(0,0,0,.25)' }} />}
                />
                <div className="contact-box">
                <Form.Item>
                    { getFieldDecorator('members')(                    
                        <Checkbox.Group>
                            {
                                contacts.filter(contact => contact.name.toLowerCase().includes(value.toLowerCase())).map((contact,index) => 

                                    (
                                    <div key={index} className="contact-row">                             
                                        <Checkbox value={contact.id}>
                                            <Avatar src={contact.avatar} style={{margin: '0 10px'}}></Avatar>
                                            <strong>{contact.name}</strong>
                                        </Checkbox>
                                    </div>
                                    )
                            )
                            }
                        </Checkbox.Group>
                    )}
                </Form.Item>
                </div>
              </div>
              
          </div>
          <Form.Item>
             <Button type="primary" htmlType="submit">Tạo</Button>
          </Form.Item>
          </Form>
      </Modal>
    )
}

const AddGroupModal = Form.create()(AddGroupModalWapper)
export default AddGroupModal