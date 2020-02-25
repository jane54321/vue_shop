import { axios } from './axios'

// 用户列表数据
export function getUsersData(queryInfo) {
    return axios({
        url: 'users',
        params: queryInfo
    })
}

// 修改用户状态
export function modifyStatus(userInfo) {
    return axios({
        url: `users/${userInfo.id}/state/${userInfo.mg_state}`,
        method: 'put'
    })
}

// 添加用户
export function addUserData(data) {
    return axios({
        url: 'users',
        method: 'post',
        data
    })
}

// 根据id查询用户信息
export function getUserData(id) {
    return axios({
        url: `users/${id}`
    })
}

// 编辑用户
export function editUserData(userData) {
    return axios({
        url: `users/${userData.id}`,
        method: 'put',
        data: {
            email: userData.email,
            mobile: userData.mobile
        }
    })
}

// 删除用户
export function delUserData(id) {
    return axios({
        url: `users/${id}`,
        method: 'delete'
    })
}

// 分配用户角色
export function assignRoles(id, rid) {
    return axios({
        url: `users/${id}/role`,
        method: 'put',
        data: {rid}
    })
}
