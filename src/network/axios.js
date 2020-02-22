import Axios from 'axios'

export function axios(option) {
    return new Promise((resolve, reject) => {
        const instance = Axios.create({
            baseURL: 'http://127.0.0.1:8888/api/private/v1/'
            // baseURL: 'http://www.vueshop.com/api/v1/'
        });

        //请求拦截
        instance.interceptors.request.use(config => {
            config.headers.Authorization = window.sessionStorage.getItem('token');
            return config;
        });

        instance(option).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}
