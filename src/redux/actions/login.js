import api from '@/axios'
import { message } from 'antd'
import { SET_USERINFO,DELETE_TOKEN } from './type.js'
const login = params => dispatch => {
  /**
   * 登录需要发送两次请求，第一次获取token
   * 第二次请求再把token传给后台，获取用户信息
   **/
  return new Promise(reslove => {
    api.post('/admin/login', params).then(res => {
      // 账号密码正确，不发送第二次请求
      if (res.data.code == 1) {
        dispatch({
          type: SET_USERINFO,
          playload: res.data.data
        })
      }
      reslove(res.data)
    })
  })
}

const deleteToken = () => dispatch=>{
  dispatch({
    type: DELETE_TOKEN
  })
  message.success('已退出登录')
  window.location = '#/login'
}

export {
  login,
  deleteToken
}