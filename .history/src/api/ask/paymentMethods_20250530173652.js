import request from '../request'
const baseURL = '/mzf'
// API支付
function getUnifiedOrderPayment (data) {
    // console.log(data)
    return request.post(`${baseURL}/xpay/epay/mapi.php`,data)
}
// 获取支付渠道列表
function obtainPaymentChannelList (data) {
    // console.log(data)
    return request.post(`${baseURL}/xpay/user-channels`,data)
}
// 查询订单状态
function queryOrderStatus(timer,data){
    return request.post(`${baseURL}/api/order/status?_t=${timer}`,data)
}

export default {
    getUnifiedOrderPayment,
    obtainPaymentChannelList,
    queryOrderStatus
}