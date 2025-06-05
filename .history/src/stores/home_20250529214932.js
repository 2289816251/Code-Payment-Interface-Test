import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index'
import { generateOrderId } from '@/hooks/useGenerateOrderId'
import { generateSign } from '@/hooks/useMD5'
import { getOrdersList, setOrdersList } from '@/hooks/useLocalStorageOrders'
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
      paymentChannelList: [],
      // 当前订单数据
      ordersData: {},
      // 支付信息
      paymentInfo: {},
      // 订单弹窗是否打开
      payModelIsShow: false
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
      try {
        let result = await api.getUnifiedOrderPayment(newData)
        // 本地存储订单
        newData.trade_no = result.trade_no
        newData.qrcode = result.qrcode
        newData.urlscheme = result.urlscheme
        newData.actualPaymentAmount = result.money
        this.localStorageOrdersList(newData)
        // 保存当前订单数据并整理支付信息

        // 打开支付弹窗
        // this.payModelIsShow = true
      } catch (error) {
        console.error(error)
      }
    },
    // 整理数据
    organizingTheData(data) {
      // 删除数量
      delete data.number
      // 添加订单号
      data.out_trade_no = generateOrderId()
      // 添加支付方式和支付渠道id
      let paymentMethodsAndpaymentChannelID = this.getPaymentChannelsThroughPaymentMethods()
      data.type = paymentMethodsAndpaymentChannelID.type
      data.channel_id = paymentMethodsAndpaymentChannelID.channel_id

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
      })[0]
      // 遍历取出符合的支付渠道列表
      let paymentChannelList = this.paymentChannelList.filter((item, index) => {
        return item.code.includes(paymentMethods.type)
      })
      return {
        type: paymentMethods.type,
        channel_id: paymentChannelList[0].id
      }
    },
    // 本地存储订单列表
    localStorageOrdersList(data) {
      // 整理订单数据
      let ordersData = {
        trade_no: data.trade_no, // 商户订单号
        out_trade_no: data.out_trade_no, // 订单号
        name: data.name, // 商品名
        money: data.money, // 原价
        param: data.param, // 备注
        type: data.type, // 支付方式
        qrcode: data.qrcode, // 二维码链接
        urlscheme: data.urlscheme, // 小程序跳转链接
        actualPaymentAmount: data.actualPaymentAmount, // 实际支付价格
        orderCreationTime: dayjs().format('YYYY-MM-DD HH:mm:ss') // 订单创建时间
      }
      // 保存当前订单数据
      this.ordersData = ordersData
      // 整理支付信息
      this.paymentInfo = () => {
        let data = this.paymentMethods.filter((item, index) => {
          return item.type == this.ordersListData.type;
        })[0];
        return data;
      };
      let ordersDataList = new Array
      ordersDataList.push(ordersData)
      // 读取本地订单列表
      let ordersList = getOrdersList()
      // 如果没有订单列表 则直接保存
      if (ordersList == null) {
        setOrdersList(ordersDataList)
      } else {
        ordersList.push(ordersData)
        setOrdersList(ordersList)
      }
    },
    // 保存订单数据
    saveOrderData() {

    },
    async postNotifyUrl(data) {
      data = JSON.parse(data)
      // 删除多余数据
      delete data.qrcode
      delete data.orderCreationTime
      delete data.actualPaymentAmount
      // 添加数据
      data.pid = this.unifiedOrderPaymentData.pid
      data.trade_status = 'TRADE_SUCCESS'
      data.sign_type = 'MD5'
      data.sign = generateSign(data, this.privateKey)
      console.log(data)
      let result = await api.notifyUrl(data)
      console.log(result)
    }
  }
})
