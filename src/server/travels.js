import api from '@/axios'

const getTravels = params  => {
    return new Promise(reslove => {
        api.get('/admin/travels', params).then(res => {
            if (res.data.code == 1) {

            }
            reslove(res.data)
        })
    })
}

const putTravels = params  => {
    return new Promise(reslove => {
        api.put(`/admin/travels/${params.id}`, params).then(res => {
            if (res.data.code == 1) {

            }
            reslove(res.data)
        })
    })
}

const deleteTravels = params  => {
    return new Promise(reslove => {
        api.delete(`/admin/travels/${params.id}`).then(res => {
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