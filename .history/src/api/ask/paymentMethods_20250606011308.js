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
    return request.get(`${baseURLNode}/testGetOrderDataList`,{
        params:{uid}
    })
}
// 通过id删除订单数据
function deleteOrderData(data) {
    return request.delete(`${baseURLNode}/testDeleteOrderData`,{
        params:data
    })
}
// 查询订单状态
function queryOrderStatus(timer, data) {
    return request.post(`${baseURL}/api/order/status?_t=${timer}`, data)
}
// 通过订单号和用户id去修改订单状态
function deleteOrderData(data) {
    return request.put(`${baseURLNode}/testUpdateOrderStatus`,data)
}

export default {
    getUnifiedOrderPayment,
    getOrderDataList,
    queryOrderStatus,
    deleteOrderData
}