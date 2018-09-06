import React, {Component} from 'react'
import './index.less'
import {connect} from 'react-redux'
import {Button, Input, Icon, Form, Checkbox,Spin } from 'antd'
import {login} from '@/redux/actions'
import PropTypes from 'prop-types'

const FormItem = Form.Item

class Login extends Component {

  static contextTypes  = {
    router: PropTypes.object
  }

  state = {
    
  }

  componentDidMount(){
    //获取用户信息
    const historyUser = localStorage.getItem('user')
    if(historyUser){
      const {user,password} = JSON.parse(historyUser)
      this.props.form.setFieldsValue({user,password,remember:true})
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {user,password,remember} = values
        remember ? localStorage.setItem('user',JSON.stringify({user,password})) : localStorage.removeItem('user')
        this.login({
          username: user,
          password
        })
      }
    })
  }

  login = formVal => {
    const { handleLogin } = this.props
    // 登录完成后 发送请求 调用接口获取用户信息
    handleLogin(formVal).then(res => {
      if(res.code == 1) {
        this.goDashBoard();
      }
    })
  }

  goDashBoard() {
    let {history} = this.context.router;
    history.replace('/table/edit');
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (

        <div className='login-container'>
          <Form
              className='content'
              onSubmit={this.handleSubmit}
          >
            <FormItem>
              {getFieldDecorator('user', {
                rules: [{ required: true, message: '请输入账号!' }],
              })(
                <Input
                    placeholder="User"
                    prefix={
                      <Icon
                          style={{ color: 'rgba(0,0,0,.25)' }}
                          type="user"
                      />}
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码!' }]
              })(
                <Input
                    placeholder="Password"
                    prefix={
                      <Icon
                          style={{ color: 'rgba(0,0,0,.25)' }}
                          type="lock"
                      />}
                    type="password"
                />
              )}
            </FormItem>
            <FormItem>
                {getFieldDecorator('remember', {
                  valuePropName: 'checked'
                })(
                  <Checkbox>记住密码</Checkbox>
                )}
                <a className='login-form-forgot'>忘记密码</a>
                <Button
                    className='login-form-button'
                    htmlType='submit'
                    type='primary'
                >
                  登录
                </Button>
            </FormItem>
          </Form>
        </div>
    )
  }
}
const mapDispatchToProps = ({
  handleLogin: params => login(params)
})

export default connect(state => ({collapsed: state.UI.taglist}), mapDispatchToProps)(Form.create()(Login))
