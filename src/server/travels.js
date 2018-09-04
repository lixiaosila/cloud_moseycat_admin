import api from '@/axios'
import { message } from 'antd'

const getTravels = params  => {
    return new Promise(reslove => {
        api.get('/admin/travels', params).then(res => {
            // 账号密码正确，不发送第二次请求
            if (res.data.code == 1) {

            }
            reslove(res.data)
        })
    })
}

const putTravels = params  => {
    return new Promise(reslove => {
        api.get('/admin/travels', params).then(res => {
            // 账号密码正确，不发送第二次请求
            if (res.data.code == 1) {

            }
            reslove(res.data)
        })
    })
}

const deleteTravels = params  => {
    return new Promise(reslove => {
        api.get('/admin/travels', params).then(res => {
            // 账号密码正确，不发送第二次请求
            if (res.data.code == 1) {

            }
            reslove(res.data)
        })
    })
}

export {
    getTravels,
    putTravels,
    deleteTravels
}