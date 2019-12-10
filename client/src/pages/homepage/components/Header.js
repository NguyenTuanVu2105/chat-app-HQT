import React, {useContext} from 'react' 
import "./Header.scss"
import { Input,  Menu, Dropdown, Button, Icon, Avatar, Badge} from 'antd';
import {logout} from '../../../helper/auth'
import AppContext from '../../../context/Appcontext'

const { Search } = Input;

const Header = (props) => {
    const context = useContext(AppContext)
    const user = context.user
    const {requests ,setRequests, contactVisible, setContactVisible} = context
    const menu = (
        <Menu>
          {/* <Menu.Item key="1">
            <a href="/">
              Thông tin cá nhân
            </a>
          </Menu.Item>
          <Menu.Item key="2">
            <a href="/">
              Cài đặt
            </a>
          </Menu.Item> */}
          <Menu.Item key="3">
            <a onClick={logout}>
            Đăng xuất
            </a>
          </Menu.Item>
        </Menu>
      );
    return (
      <div className="header-wrap">
          <div className="header">
            <div className="col-2 logo">
                <a style={{display: "block", height: "100%", lineHeight:"40px", textDecoration:'none', color:"#e9e9e9", fontSize: "25px", fontWeight:"bold"}}>
                    CHAT AVS
                </a>
            </div>
            <div className="col-6 search">
                <Search
                    placeholder="Nhập tìm kiếm của bạn"
                    onSearch={value => console.log(value)}
                    style={{ width: "70%" }}
                />
            </div>
            <div className="col-4 app">
                <div className="tool">
                  <Badge count={requests.length} offset={[-10,10]}>
                    <Button className="btn-header" onClick={() => setContactVisible(true)} size="large"><Icon type="user-add" /></Button>
                  </Badge>
                  <Badge count={0} offset={[-10,10]}>
                    <Button className="btn-header" size="large"><Icon type="bell" theme="filled" /></Button>
                  </Badge>   
                </div>
                <Dropdown overlay={menu}>
                <Button className="btn-avatar">
                    <Avatar src={user.avatar}></Avatar>
                    &nbsp; &nbsp; {user.name}
                    <Icon type="down" />
                </Button>
                </Dropdown>
            </div>
        </div>
      </div>
    )
}

export default Header 