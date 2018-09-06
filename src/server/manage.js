import api from '@/axios'

const getAdmin = params  => {
    return new Promise(reslove => {
        api.get('/admin/users', params).then(res => {
            if (res.data.code == 1) {

            }
            reslove(res.data)
        })
    })
}

const putAdmin = params  => {
    return new Promise(reslove => {
        api.put(`/admin/users/${params.id}`, params).then(res => {
            if (res.data.code == 1) {

            }
            reslove(res.data)
        })
    })
}

const deleteAdmin = params  => {
    return new Promise(reslove => {
        api.delete(`/admin/users/${params.id}`).then(res => {
            if (res.data.code == 1) {

            }
            reslove(res.data)
        })
    })
}

const addAdmin = params  => {
    return new Promise(reslove => {
        api.post('/admin/users', params).then(res => {
            if (res.data.code == 1) {

            }
            reslove(res.data)
        })
    })
}

export {
    addAdmin,
    deleteAdmin,
    putAdmin,
    getAdmin
}