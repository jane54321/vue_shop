import {axios} from "./axios";

// 获取折线图数据
export function getReportData() {
    return axios({
        url: 'reports/type/1'
    })
}
