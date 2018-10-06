import api from '@/axios'

const getGuiders= params  => {
    return new Promise(reslove => {
        api.get('/admin/designers', {
            params
          }).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}
const deleteGuider = params  => {
    return new Promise(reslove => {
        api.delete(`/admin/designers/${params.id}`).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}
const getGuider= params  => {
    return new Promise(reslove => {
        api.get(`/admin/designers/${params.id}`, {
            params
          }).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}
const addGuider = params  => {
    return new Promise(reslove => {
        api.post('/admin/designers', params).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}
const putGuider = params  => {
    return new Promise(reslove => {
        api.put(`/admin/designers/${params.id}`, params).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }   
        })
    })
}
const getBanner = params => {
    return new Promise(reslove => {
        api.get('/admin/designers/banner', {
            params
          }).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}
const putBanner = params  => {
    return new Promise(reslove => {
        api.put('/admin/designers/banner', params).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }   
        })
    })
}

export {
    getGuiders,
    deleteGuider,
    getGuider,
    addGuider,
    putGuider,
    getBanner,
    putBanner
}