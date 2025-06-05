import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index'
import { generateOrderId } from '@/hooks/useGenerateOrderId'
var dayjs = require('dayjs')

export const useHomeStore = defineStore('home', {
  state: () => {
    return {
      unifiedOrderPaymentData: {
        pid: 1187, // 商户id
        method: 'web', // 接口类型
        device: 'pc', // 设备类型
        type: '', // 支付方式
        out_trade_no: '', // 商户订单号
        notify_url: 'http://www.pay.com/notify_url.php', // 异步通知地址
        return_url: 'http://www.pay.com/return_url.php', // 跳转通知地址
        name: '', // 商品名称
        money: '', // 商品金额
        clientip: '192.168.1.100', // 用户ip地址
        param: '', // 业务扩展参数
        auth_code: '', // 被扫支付授权
        sub_openid: '', // 用户Openid
        sub_appid: '', // 公众号Appid
        timestamp: '', // 当前时间戳
        sign: '', // 签名字符串
        sign_type: 'RSA' // 签名类型
      },
      // 支付方式
      paymentMethods: [
        {
          id: 0,
          title: "支付宝",
          image: "/src/assets/images/zfb.png",
          type: "alipay",
          state: 1,
        },
        {
          id: 1,
          title: "微信",
          image: "/src/assets/images/wx.png",
          type: "wxpay",
          state: 0,
        },
      ]
    }
  },
  actions: {
    // 切换支付方式
    switchPaymentMethods(item) {
      this.paymentMethods.forEach((e) => {
        e.state = 0;
        if (e.id == item.id) e.state = 1;
      });
    },
    // 统一支付
    async unifiedOrderPayment(data) {
      let newData =  this.organizingTheData(data)
      console.log(newData)
      let result = await api.getUnifiedOrderPayment(this.unifiedOrderPaymentData)
      console.log(result)
    },
    organizingTheData(data){
      // 删除数量
      delete data.number
      // 添加订单号
      data.out_trade_no = generateOrderId()
      // 添加时间戳
      data.timestamp = dayjs().valueOf()
      return data
    }
  }
})
