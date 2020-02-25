import {axios} from "./axios";

// 获取权限列表
export function getRightsData(type) {
    return axios({
        url: `rights/${type}`
    })
}

// 获取角色列表
export function getRolesData() {
    return axios({
        url: 'roles'
    })
}

// 根据id删除三级分类
export function removeRightData(roleId, rightId) {
    return axios({
        url: `roles/${roleId}/rights/${rightId}`,
        method: 'delete'
    })
}

// 角色授权
export function roleAuthorization(roleId, data) {
    return axios({
        url: `roles/${roleId}/rights`,
        method: 'post',
        data: {rids: data}
    })
}

// 根据id查询角色
export function getRoleById(id) {
    return axios({
        url: `roles/${id}`
    })
}
