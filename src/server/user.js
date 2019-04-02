import api from '@/axios'

const getUser= params  => {
    return new Promise(reslove => {
        api.get('/admin/wechat/users', {
            params
          }).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}

export {
    getUser
}
