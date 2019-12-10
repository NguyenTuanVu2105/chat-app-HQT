import React, { useState, useEffect, useContext } from 'react'
import { Modal, Button, Tabs, Input, Card, Badge, Avatar} from 'antd';
import axios from 'axios'
import ContactBox from './ContactBox';
import './AddContactModal.scss'
import {host} from '../../../../../helper/common'
import {socket} from '../../../../../helper/socket'
import AppContext from '../../../../../context/Appcontext'
import { createAuthApi } from '../../../../../helper/auth';

const {Search} = Input
const {TabPane} = Tabs
const AddContactModal = (props) => {
    const context = useContext(AppContext)
    const myUser = context.user 
    const {requests ,setRequests, getStatus, contacts, setContacts, getRoom} = context

    const {visible, setVisible} = props
    const [searchUsers, setSearchUsers] = useState([])
    const [currentUser, setCurrentUser] = useState(null)
    const [listAcceptRequest, setListAcceptRequest] = useState([])

    const handleCancel = () => {
        setVisible(false)
    }

    const getContact = async () => {
        const data = await createAuthApi({url: '/api/contacts', method: 'GET'})
        if (!data.error) setContacts(data)
    }

    const getApceptRequest = async () => {
        const data = await createAuthApi({url: '/api/requests/sent', method: 'GET'})
        if (!data.error) setListAcceptRequest(data)
    }
    const getRequest = async() => {
        const data = await createAuthApi({url: '/api/requests/imcoming', method: 'GET'})      
        if (!data.error) setRequests(requests=>data)
    }

    useEffect(()=> {
        if (myUser.id) {
            getRequest()
            getApceptRequest()
            getContact()
            getRoom()
            socket.on(`request ${myUser.id}`, function(sender) {
                getRequest()
              })
            socket.on(`accept ${myUser.id}`, function(user) {
                getRequest()
                getApceptRequest()
                getRoom()
                getStatus()
            })
            socket.on(`deline ${myUser.id}`, function(user) {
                getRequest()
                getApceptRequest()
            })
        }
    }, [myUser])

    const handleSearch = async (value) => {
        const data = await createAuthApi({url: `/api/users/search?q=${value}`, method: 'GET'})
        setSearchUsers(filterData(data))
    }
    
    const filterData = (data) => {
        if (data.length === 0) return data
        var res = []
        for (var i=0; i< data.length; i++) {
            if (!checkUser(data[i], requests)) {
                res.push(data[i])
            }
        }
        return res
    }

    const handleAddContact = (user) => {
        socket.emit(`request`, {
            sender: myUser,
            receiver: user,
            status: 'request'
        }) 
        getRequest()
        getApceptRequest()
    }

    const checkUser = (ele, a) => {
        if (a.length === 0) return false
        for (var i=0; i<a.length; i++) {
            if (a[i].id === ele.id) return true
        }
        return false
    }

    const handleAccept = (user) => {
        socket.emit(`request`, {
            sender: user,
            receiver: myUser,
            status: 'accept'
        }) 
        getRequest()
        getContact()
        getRoom()
        getStatus()
        setCurrentUser(currentUser => null)
    }

    const handleDeline = (user) => {
        socket.emit(`request`, {
            sender: user,
            receiver: myUser,
            status: 'deline'
        }) 
        getRequest()
        setCurrentUser(currentUser => null)
    }

    const handleCancelRequest = (user) => {
        socket.emit(`request`, {
            sender: myUser,
            receiver: user,
            status: 'deline'
        }) 
        getRequest()
        getApceptRequest()
        setCurrentUser(currentUser => null)
    }

    return(
        <Modal
        visible={visible}
        title="Quản lý liên lạc"
        onCancel={handleCancel}
        className="contact-modal"
        footer={null}
        width={700}
      >
        <Tabs defaultActiveKey="1" size="small" onTabClick={()=>{
            setCurrentUser(null)
        }}>
          <TabPane tab="Tìm kiếm liên lạc" key="1">
            <div className="header">
            <Search
                placeholder="Tìm kiếm user bằng tên hoặc email"
                onSearch={handleSearch}
                style={{ width: 400 }}
                size="small"
                onChange={(e) => {
                    if (e.target.value === '') {
                        setCurrentUser(null)
                        setSearchUsers(searchUsers => [])
                    }
                }}
            />
            </div>
            <div className="user-search-body">
                <div className="user-box-list">
                {
                    searchUsers.map((user, index) => (
                        <ContactBox setCurrentUser={setCurrentUser} user={user} handleAddContact={handleAddContact}></ContactBox>
                    ))
                }
                </div>
                <div className="user-search-detail">
                    { currentUser && (
                    <Card title={currentUser.fullname}>
                        <table>
                            <tr>
                                <td style={{fontWeight: 'bold', width:'100px'}}>Name:</td>
                                <td>{currentUser.name}</td>
                            </tr>
                            <tr>
                                <td style={{fontWeight: 'bold', width:'100px'}}>Email:</td>
                                <td>{currentUser.email}</td>
                            </tr>
                            <tr>
                                <td style={{fontWeight: 'bold', width:'100px'}}>Address:</td>
                                <td>{currentUser.address}</td>
                            </tr>
                        </table>
                    </Card>
                    )
                                        }
                </div>
            </div>
          </TabPane>
          <TabPane tab={`Danh bạ (${contacts.length})`} key="2">
          <div className="user-search-body">
                <div className="user-box-list">
                {
                    contacts.map((user, index) => (
                    <div key={index} className="chat-box-contact">
                        <div className="chat-box-cell" style={{display:'flex', padding:'10px'}} onClick={() => setCurrentUser(user)}>
                            <Avatar src={user.avatar}></Avatar>
                            <p>{user.name}</p>
                        </div>
                    </div>
                    ))
                }
                </div>
                <div className="user-search-detail">
                    { currentUser && (
                    <Card title={currentUser.name}>
                        <table>
                            <tr>
                                <td style={{fontWeight: 'bold', width:'100px'}}>Name:</td>
                                <td>{currentUser.name}</td>
                            </tr>
                            <tr>
                                <td style={{fontWeight: 'bold', width:'100px'}}>Email:</td>
                                <td>{currentUser.email}</td>
                            </tr>
                            <tr>
                                <td style={{fontWeight: 'bold', width:'100px'}}>Address:</td>
                                <td>{currentUser.address}</td>
                            </tr>
                        </table>
                    </Card>
                    )
                                        }
                </div>
            </div>        
          </TabPane>
          <TabPane tab={(<Badge className="imcoming-request" count={requests.length}><p>Yêu cầu</p></Badge>)} key="3">
            <div className="user-search-body">
                <div className="user-box-list">
                {
                    requests.map((user, index) => (
                    <div key={index} className="chat-box-contact">
                        <div className="chat-box-cell" style={{display:'flex', padding:'10px'}} onClick={() => setCurrentUser(user)}>
                            <Avatar src={user.avatar}></Avatar>
                            <p>{user.name}</p>
                        </div>
                        <div style={{width:'100%', padding:"10px 0", display:'flex', justifyContent:'center', border:'1px solid #e6e6e6', background:'#dedede'}}>
                            <Button type="primary" onClick={() => handleAccept(user)} style={{width:'100px', margin: '0 15px'}}>Chấp nhận</Button>
                            <Button type="danger" onClick={() => handleDeline(user)} style={{width:'100px', margin: '0 15px'}}>Từ chối</Button>
                        </div>
                    </div>
                    ))
                }
                </div>
                <div className="user-search-detail">
                    { currentUser && (
                    <Card title={currentUser.name}>
                        <table>
                            <tr>
                                <td style={{fontWeight: 'bold', width:'100px'}}>Name:</td>
                                <td>{currentUser.name}</td>
                            </tr>
                            <tr>
                                <td style={{fontWeight: 'bold', width:'100px'}}>Email:</td>
                                <td>{currentUser.email}</td>
                            </tr>
                            <tr>
                                <td style={{fontWeight: 'bold', width:'100px'}}>Address:</td>
                                <td>{currentUser.address}</td>
                            </tr>
                        </table>
                    </Card>
                    )
                                        }
                </div>
            </div>
          </TabPane>
          {listAcceptRequest.length && 
            <TabPane tab={`Đang chờ xác nhận (${listAcceptRequest.length})`} key="4">
             <div className="user-search-body">
                <div className="user-box-list">
                {
                    listAcceptRequest.map((user, index) => (
                    <div className="chat-box-contact">
                        <div className="chat-box-cell" style={{display:'flex', padding:'10px'}} onClick={() => setCurrentUser(user)}>
                            <Avatar src={user.avatar}></Avatar>
                            <p>{user.name}</p>
                        </div>
                        <div style={{width:'100%', padding:"10px 0", display:'flex', justifyContent:'center', border:'1px solid #e6e6e6', background:'#dedede'}}>
                            <Button type="danger" onClick={() => handleCancelRequest(user)} style={{width:'100px', margin: '0 15px'}}>Hủy yêu cầu</Button>
                        </div>
                    </div>
                    ))
                }
                </div>
                <div className="user-search-detail">
                    { currentUser && (
                    <Card title={currentUser.name}>
                        <table>
                            <tr>
                                <td style={{fontWeight: 'bold', width:'100px'}}>Name:</td>
                                <td>{currentUser.name}</td>
                            </tr>
                            <tr>
                                <td style={{fontWeight: 'bold', width:'100px'}}>Email:</td>
                                <td>{currentUser.email}</td>
                            </tr>
                            <tr>
                                <td style={{fontWeight: 'bold', width:'100px'}}>Address:</td>
                                <td>{currentUser.address}</td>
                            </tr>
                        </table>
                    </Card>
                    )
                                        }
                </div>
            </div>           
            </TabPane>
          }

        </Tabs>
      </Modal>
    )
}

export default AddContactModal