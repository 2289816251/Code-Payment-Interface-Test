import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index'
import { generateOrderId } from '@/hooks/useGenerateOrderId'
import { generateSign } from '@/hooks/useMD5'
import dayjs from 'dayjs'

export const useHomeStore = defineStore('home', {
  state: () => {
    return {
      unifiedOrderPaymentData: {
        pid: '10501', // 商户id
        type: '', // 支付方式
        out_trade_no: '', // 商户订单号
        notify_url: 'http://www.pay.com/notify_url.php', // 异步通知地址
        return_url: 'http://www.pay.com/return_url.php', // 跳转通知地址
        name: '', // 商品名称
        money: '', // 商品金额
        clientip: '185.180.13.119', // 用户ip地址
        device: 'pc', // 设备类型
        param: '', // 业务扩展参数
        channel_id: '1', // 支付渠道ID
        sign: '', // 签名字符串
        sign_type: 'MD5' // 签名类型
      },
      // 商户公钥
      privateKey: `G7jllqJkgpaBMcpvhah7`,
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
      ],
      // 支付渠道列表
      paymentChannelList: []
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
    // API支付
    async paymentViaAPI(data) {
      let newData = this.organizingTheData(data)
      let result = await api.getUnifiedOrderPayment(newData)
      console.log(result)
    },
    // 整理数据
    organizingTheData(data) {
      // 删除数量
      delete data.number
      // 添加订单号
      data.out_trade_no = generateOrderId()
      // 添加支付方式
      data.type = ''
      let a =  this.getPaymentChannelsThroughPaymentMethods()

      let result = Object.assign(this.unifiedOrderPaymentData, data)

      result.sign = generateSign(result, this.privateKey)

      return result
    },
    // 获取支付渠道列表
    async getObtainPaymentChannelList() {
      let data = {
        pid: this.unifiedOrderPaymentData.pid,
        timestamp: dayjs().unix().toString()
      }
      data.sign = generateSign(data, this.privateKey)

      try {
        let result = await api.obtainPaymentChannelList(data)
        this.paymentChannelList = result.data
      } catch (error) {
        console.error(error)
      }
    },
    // 通过支付方式获取支付渠道并返回
    getPaymentChannelsThroughPaymentMethods() {
      // 获取支付方式
      let paymentMethods = this.paymentMethods.filter((item, index) => {
        return item.state == 1
      })[0].type
      // 遍历取出符合的支付渠道列表
      let paymentChannelList = this.paymentChannelList.filter((item,index)=>{
        console.log(item)
      })
    }
  }
})
