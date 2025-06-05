import request from '../request'
const baseURL = '/yzf'
// 通一下单支付
function getUnifiedOrderPayment (data) {
    console.log(data)
    return request({
        method:'post',
        url:`${baseURL}/api/pay/create`,
    })
}

export default {
    getUnifiedOrderPayment
}