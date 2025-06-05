import request from '../request'
const baseURL = '/mzf'
const baseURLNode = '/test'
// API支付
function getUnifiedOrderPayment(data) {
    // console.log(data)
    return request.post(`${baseURLNode}/testPay`, data)
}
// 获取订单数据
function getOrderDataList(uid) {
    return request.get(`${baseURLNode}/testGetOrderDataList?uid = ${uid}`)
}
// 查询订单状态
function queryOrderStatus(timer, data) {
    return request.post(`${baseURL}/api/order/status?_t=${timer}`, data)
}

export default {
    getUnifiedOrderPayment,
    getOrderDataList,
    queryOrderStatus
}