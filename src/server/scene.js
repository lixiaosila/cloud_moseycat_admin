import api from '@/axios'

const getScenes= params  => {
    return new Promise(reslove => {
        api.get('/admin/views', {
            params
          }).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}
const deleteScene = params  => {
    return new Promise(reslove => {
        api.delete(`/admin/views/${params.id}`).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}
const getScene= params  => {
    return new Promise(reslove => {
        api.get(`/admin/views/${params.id}`, {
            params
          }).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}
const addScene = params  => {
    return new Promise(reslove => {
        api.post('/admin/views', params).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}
const putScene = params  => {
    return new Promise(reslove => {
        api.put(`/admin/views/${params.id}`, params).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }   
        })
    })
}

export {
    getScenes,
    deleteScene,
    getScene,
    addScene,
    putScene
}