import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index'

export const useHomeStore = defineStore('home', {
  state:()=>{
    return{
      unifiedOrderPaymentData:{
        pid:1187, // 商户id
        method:'web', // 接口类型
        device:'pc', // 设备类型
        type:'', // 支付方式
        out_trade_no:'', // 商户订单号
        notify_url:'http://www.pay.com/notify_url.php', // 异步通知地址
        return_url:'http://www.pay.com/return_url.php', // 跳转通知地址
        name:'', // 商品名称
        money:'', // 商品金额
        clientip:'192.168.1.100', // 用户ip地址
        param:'', // 业务扩展参数
        auth_code:'', // 被扫支付授权
        sub_openid:'', // 用户Openid
        sub_appid:'', // 公众号Appid
        timestamp:'', // 当前时间戳
        sign:'', // 签名字符串
        sign_type:'RSA' // 签名类型
      }
    }
  },
  actions:{
    // 统一支付
    async unifiedOrderPayment(){
      let result = await api.getUnifiedOrderPayment()
      console.log(result)
    }
  }
})
