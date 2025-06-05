import request from '../request'

// 通一下单支付
function getUnifiedOrderPayment (data) {
    return request({
        method:'post',
        url:`/api/pay/create`,
        data
    })
}

export default {
    getUnifiedOrderPayment
}