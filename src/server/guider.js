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
export {
    getGuiders,
    deleteGuider
}