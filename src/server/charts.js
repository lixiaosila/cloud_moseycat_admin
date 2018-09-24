import api from '@/axios'

const getCharts = params  => {
    return new Promise(reslove => {
        api.get('/admin/travels/chart', {
            params
          }).then(res => {
            if (res.data.code == 1) {
                reslove(res.data)
            }
        })
    })
}
export {
    getCharts
}