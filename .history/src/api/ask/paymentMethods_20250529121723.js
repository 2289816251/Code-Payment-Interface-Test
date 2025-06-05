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

export default {
    getUnifiedOrderPayment,
    obtainPaymentChannelList
}