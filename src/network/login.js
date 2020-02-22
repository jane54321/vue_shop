import { axios } from './axios'

// 登录请求
export function loging(data) {
    return axios({
        url: 'login',
        method: 'post',
        data
    })
}
