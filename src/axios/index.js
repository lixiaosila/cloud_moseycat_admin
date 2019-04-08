import axios from 'axios'
import qs from 'qs'

import { message } from 'antd'
message.config({
    maxCount: 1,
});

const api = axios.create({
    baseURL: "//wanqiantest.hizeng.cn",
    timeout: 5000,
    withCredentials: true // 允许携带cookie
})

//请求拦截
api
    .interceptors
    .request
    .use(function (config) {
        if (config.method === 'post') {
            config.data = qs.stringify(config.data);
        }
        return config
    }, function (error) {
        message.error(error);
        return Promise.reject(error);
    })

// 添加响应拦截器
api
    .interceptors
    .response
    .use(function (response) {
        if (response.data.code != 1) { 
            message.error(response.data.msg);
            if(response.data.code == -3) {
                window.location.href = '#/login'
            }
        }

        return response

    }, function (error) {
        if (error.response) {
            if (error.response.status === 401) {
                message.error(error.response.data.msg)
                window.location.href = '#/login'
            }
        }
        return Promise.reject(error)
    })

export default api
