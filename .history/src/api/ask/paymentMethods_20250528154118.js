import request from '../request'
const baseURL = '/mzf'
// 通一下单支付
function getUnifiedOrderPayment (data) {
    // console.log(data)
    return request.post(`${baseURL}/xpay/epay/mapi.php`,data)
}

export default {
    getUnifiedOrderPayment
}