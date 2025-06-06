import request from '../request'
const baseURL = '/test'
// API支付
function getUnifiedOrderPayment(data) {
    // console.log(data)
    return request.post(`${baseURL}/testPay`, data)
}
// 获取订单数据
function getOrderDataList(uid) {
    return request.get(`${baseURL}/testGetOrderDataList`,{
        params:{uid}
    })
}
// 通过id删除订单数据
function deleteOrderData(data) {
    return request.delete(`${baseURL}/testDeleteOrderData`,{
        params:data
    })
}
// 查询订单状态
function queryOrderStatus(timer, data) {
    return request.post(`${baseURL}/testGetOrderStatus`, data)
}
// 通过订单号和用户id去修改订单状态
function updateOrderStatus(data) {
    return request.put(`${baseURL}/testUpdateOrderStatus`,data)
}

export default {
    getUnifiedOrderPayment,
    getOrderDataList,
    queryOrderStatus,
    deleteOrderData,
    updateOrderStatus
}