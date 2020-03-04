import { axios } from './axios'

export function getOrderData(queryInfo) {
    return axios({
        url: 'orders',
        params: queryInfo
    })
}

// 获取物流信息
export function getProgressData(id) {
    return axios({
        url: `kuaidi/${id}`
    })
}
