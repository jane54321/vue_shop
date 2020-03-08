import Axios from 'axios'
// 导入NProgress和对应的样式和js
import NProgress from 'nprogress'
// 生产环境下不引用，使用外部加载
if (process.env.NODE_ENV === 'development') {
    import ('nprogress/nprogress.css')
}


export function axios(option) {
    return new Promise((resolve, reject) => {
        const instance = Axios.create({
            baseURL: 'http://127.0.0.1:8888/api/private/v1/'
            // baseURL: 'http://www.vueshop.com/api/v1/'
        });

        // 在request拦截器中展示进度条
        // 请求拦截
        instance.interceptors.request.use(config => {
            NProgress.start();
            config.headers.Authorization = window.sessionStorage.getItem('token');
            return config;
        });

        // 在response拦截器中隐藏进度条
        // 响应拦截
        instance.interceptors.response.use(config => {
            NProgress.done();
            return config;
        });

        instance(option).then(res => {
            resolve(res);
        }).catch(err => {
            reject(err);
        })
    })
}
