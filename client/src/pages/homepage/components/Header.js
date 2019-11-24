import React, {useContext} from 'react' 
import "./Header.scss"
import { Input,  Menu, Dropdown, Button, Icon, Avatar} from 'antd';
import {logout} from '../../../helper/auth'
import AppContext from '../../../Appcontext'
const { Search } = Input;

const Header = (props) => {
    const context = useContext(AppContext)
    const user = context.user

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
                    style={{ width: "50%" }}
                />
            </div>
            <div className="col-4 app">
                <Dropdown overlay={menu}>
                <Button className="btn-avatar">
                    <Avatar src={user.avatar}></Avatar>
                    &nbsp; &nbsp; {user.fullname}
                    <Icon type="down" />
                </Button>
                </Dropdown>
            </div>
        </div>
      </div>
    )
}

export default Header 