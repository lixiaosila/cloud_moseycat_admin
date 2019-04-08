import api from '@/axios'

const getUser = params  => {
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

const getConfig = params  => {
    return new Promise(reslove => {
        api.get('/admin/indexConfig', {
            params
          }).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}

const putConfig = params  => {
    return new Promise(reslove => {
        api.put('/admin/indexConfig', params).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}

const restart = params  => {
    return new Promise(reslove => {
        api.post('/admin/restart', params).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}

export {
    getUser,
    getConfig,
    putConfig,
    restart
}
