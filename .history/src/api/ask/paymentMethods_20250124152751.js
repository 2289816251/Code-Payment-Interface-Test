import request from '../request'

// 通一下单支付
function getUnifiedOrderPayment () {
    return request({
        method:'post',
        url:`/api/pay/create`
    })
}

export default {
    getUnifiedOrderPayment
}