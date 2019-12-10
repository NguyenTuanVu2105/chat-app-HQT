import React, {useContext, useState} from 'react' 
import './Login.scss'
import { Form, Icon, Input, Alert, Button, Checkbox } from 'antd';
import axios from 'axios';
import AppContext from '../../context/Appcontext'
import { withRouter } from 'react-router-dom'
import {host} from '../../helper/common'
import {setUserCookies, getUser, checkAuth} from '../../helper/auth'

const LoginWrap = (props) => {
    const context = useContext(AppContext)
    if (checkAuth()) {
        props.history.push('/')
    }
    const [message, setMessage] = useState('')
    const submitLogin = async (value) => {
        setUserCookies(value.token)
        const user = await getUser()
        context.setUser({
            id: user.id,
            email: user.email,
            name: user.name,
            address: user.address,
            avatar: user.avatar 
        })
        props.history.push('/')
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
          if (!err) {
            axios.post(`${host}/api/login`, values)
            .then(res => {
                console.log(res.data)
                if (res.data.success) {
                    submitLogin(res.data)
                } else {
                    setMessage(res.data.message)
                }
            })
          }
        });
    }
    const { getFieldDecorator } = props.form;
    return (
        <div className="login-wrap">
            <Form onSubmit={handleSubmit} className="login-form">
            {message && <Alert style={{marginBottom: '20px'}} message={message} type="error"/>}
                <Form.Item>
                {getFieldDecorator('email', {
                    rules: [{ required: true, message: 'Please input your email!' }],
                })(
                    <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Email"
                    />,
                )}
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('password', {
                    rules: [{ required: true, message: 'Please input your Password!' }],
                })(
                    <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                    />,
                )}
                </Form.Item>
                <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Log in
                </Button>
                Or <a href="/register">register now!</a>
                </Form.Item>
            </Form>
        </div>
    )
}

const Login = Form.create()(LoginWrap);

export default withRouter(Login)