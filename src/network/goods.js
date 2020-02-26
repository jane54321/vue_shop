import {axios} from "./axios";

// 商品分类数据
export function getCategories(queInfo) {
    return axios({
        url: 'categories',
        params: queInfo
    })
}

// 获取父级分类的数据列表
export function getParentCateData() {
    return axios({
        url: 'categories',
        params: {
            type: 2
        }
    })
}

// 添加新的分类
export function addCateData(data) {
    return axios({
        url: 'categories',
        method: 'post',
        data
    })
}
