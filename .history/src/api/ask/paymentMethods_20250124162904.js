import request from '../request'
const baseURL = '/yzf'
// 通一下单支付
function getUnifiedOrderPayment (data) {
    // console.log(data)
    return request.post(`${baseURL}/api/pay/create`,data)
}

export default {
    getUnifiedOrderPayment
}