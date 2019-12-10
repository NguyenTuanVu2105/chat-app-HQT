import React, { useState, useContext } from 'react' 
import './Register.scss'
import { Form, Icon, Input, Button, Checkbox, Alert, notification} from 'antd';
import axios from 'axios'
import AppContext from '../../context/Appcontext'
import { withRouter } from 'react-router-dom'
import {host} from '../../helper/common'

const RegisterWrap = (props) => {
  const context = useContext(AppContext)
  if (context.user.id) {
      props.history.push('/')
  }
    const [confirmDirty, setConfirmDirty] = useState(false)
    const [message, setMessage] = useState('')
    const handleSubmit = (e) => {
        e.preventDefault();
        props.form.validateFields((err, values) => {
          if (!err) {
            axios.post(`${host}/api/register`, values)
            .then(res => {
              if (res.data.success) {
                    notification['success']({
                    message: 'Register Success',
                  });
                  props.history.push('/login')
              } else {
                  setMessage(res.data.message)
              }
            })
          }
        });
    }
    const compareToFirstPassword = (rule, value, callback) => {
        const { form } = props;
        if (value && value !== form.getFieldValue('password')) {
          callback('passwords confirm is incorrect');
        } else {
          callback();
        }
      };

    const handleConfirmBlur = e => {
        const { value } = e.target;
        setConfirmDirty(confirmDirty => confirmDirty || !!value)
      };
    
    const validateToNextPassword = (rule, value, callback) => {
        const { form } = props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      };
    const { getFieldDecorator } = props.form;
    return (
        <div className="login-wrap">
            <Form onSubmit={handleSubmit} className="login-form">
            {message && <Alert style={{marginBottom: '20px'}} message={message} type="error"/>}
                <Form.Item>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: 'Please input your name!' }],
                    })(
                        <Input
                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                        placeholder="Fullname"
                        />,
                    )}
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('address', {
                    rules: [{ required: true, message: 'Please input your address!' }],
                })(
                    <Input
                    prefix={<Icon type="environment" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Address"
                    />,
                )}
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('email', {
                    rules: [
                    { required: true, message: 'Please input your email!' }, 
                    {
                      type: 'email',
                      message: 'The input is not valid E-mail!',
                    },],
                })(
                    <Input
                    prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Email"
                    />,
                )}
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('password', {
                    rules: [
                        { required: true, message: 'Please input your Password!' },               
                        { validator: validateToNextPassword,}
                    ],
                })(
                    <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Password"
                    />,
                )}
                </Form.Item>
                <Form.Item>
                {getFieldDecorator('confirm', {
                    rules: [{ required: true, message: 'Please input your Password!' }, {validator: compareToFirstPassword}],
                })(
                    <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="Confirm Password"
                    onBlur={handleConfirmBlur} 
                    />,
                )}
                </Form.Item>
                <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                    Register
                </Button>
                Or <a href="/login">login now!</a>
                </Form.Item>
            </Form>
        </div>
    )
}

const Register = Form.create()(RegisterWrap);

export default withRouter(Register) 