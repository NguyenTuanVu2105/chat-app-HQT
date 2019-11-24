import React, {useContext, useState} from 'react' 
import './Login.scss'
import { Form, Icon, Input, Alert, Button, Checkbox } from 'antd';
import axios from 'axios';
import AppContext from '../../Appcontext'
import { withRouter } from 'react-router-dom'

const LoginWrap = (props) => {
    const context = useContext(AppContext)
    if (context.user.username) {
        props.history.push('/')
    }
    const [message, setMessage] = useState('')
    const submitLogin = (value) => {
        context.setUser({
            username: value.username,
            fullname: value.fullname,
            avatar: value.avatar 
        })
        props.history.push('/')
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
          if (!err) {
            axios.post('http://localhost:5000/api/login', values)
            .then(res => {
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
                {getFieldDecorator('username', {
                    rules: [{ required: true, message: 'Please input your username!' }],
                })(
                    <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Username"
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