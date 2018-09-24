import axios from 'axios'
import store from '@/redux/store'
import qs from 'qs'

import {message} from 'antd'
message.config({
  maxCount: 1,
});

const api = axios.create({
  baseURL: "http://moseycat.com:8081",
  timeout: 5000,
  withCredentials: true // 允许携带cookie
})

//请求拦截
api
  .interceptors
  .request
  .use(function (config) {
    // 在发送请求之前做些什么
    // 通过reudx的store拿到拿到全局状态树的token ，添加到请求报文，后台会根据该报文返回status
    const token = store.getState().user.token || localStorage.getItem('token')
    config.headers['X-Token'] = token
    if (config.method === 'post') {
      config.data = qs.stringify(config.data);
     }

    return config

  }, function (error) {
    // 对请求错误做些什么
    message.error(error)

    return Promise.reject(error)
  })

// 添加响应拦截器
api
  .interceptors
  .response
  .use(function (response) {
    // 对响应数据做点什么
    if (response.data.code != 1) { 
      message.error(response.data.msg);
    }
    return response

  }, function (error) {
    // 对响应错误做点什么
    if (error.response) {
      
      if (error.response.status === 401) {
        // 如果返回401 即没有权限，跳到登录页重新登录
         message.error(error.response.data.msg)

         window.location.href = '#/login'

      }
    }

    return Promise.reject(error)
  })

export default api
