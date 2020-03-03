import {axios} from "./axios";

// 商品分类数据
export function getCategories(queInfo = {}) {
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

// 根据id查询分类信息
export function geteditCateData(id) {
    return axios({
        url: `categories/${id}`
    })
}

// 修改分类信息
export function editCateData(data) {
    return axios({
        url: `categories/${data.cat_id}`,
        method: 'put',
        data: {
            cat_name: data.cat_name
        }
    })
}

// 删除分类信息
export function delCateData(id) {
    return axios({
        url: `categories/${id}`,
        method: 'delete'
    })
}

// 获取动态/静态参数
export function getCateData(id, type) {
    return axios({
        url: `categories/${id}/attributes`,
        params: {
            sel: type
        }
    })
}

// 添加动态/静态参数
export function addParamData(data) {
    return axios({
        url: `categories/${data.id}/attributes`,
        method: 'post',
        data: {
            attr_name: data.attr_name,
            attr_sel: data.attr_sel
        }
    })
}

// 根据id查询动态/静态参数
export function getParamById(cateId, attrId, attr_sel) {
    return axios({
        url: `categories/${cateId}/attributes/${attrId}`,
        params: {
            attr_sel
        }
    })
}

// 编辑动态/静态参数
export function editParamData(data) {
    return axios({
        url: `categories/${data.cat_id}/attributes/${data.attr_id}`,
        method: 'put',
        data: {
            attr_name: data.attr_name,
            attr_sel: data.attr_sel,
            attr_vals: data.attr_vals
        }
    })
}

// 删除动态/静态参数
export function delParamData(catId, attrId) {
    return axios({
        url: `categories/${catId}/attributes/${attrId}`,
        method: 'delete'
    })
}

// 获取商品列表数据
export function getGoodsData(queryInfo) {
    return axios({
        url: 'goods',
        params: queryInfo
    })
}

// 删除商品
export function delGoodsData(id) {
    return axios({
        url: `goods/${id}`,
        method: 'delete'
    })
}

// 添加商品
export function addGoodsData(data) {
    return axios({
        url : "goods",
        method: 'post',
        data
    })
}

// 根据id查询商品信息
export function getGoodsById(id) {
    return axios({
        url: `goods/${id}`
    })
}

// 编辑提交商品
export function editGoodsData(data) {
    return axios({
        url: `goods/${data.id}`,
        method: 'put',
        data: {
            goods_name: data.goods_name,
            goods_price: data.goods_price,
            goods_number: data.goods_number,
            goods_weight: data.goods_weight,
            goods_introduce: data.goods_introduce,
            goods_cat: data.goods_cat,
            pics: data.pics,
            attrs: data.attrs
        }
    })
}
