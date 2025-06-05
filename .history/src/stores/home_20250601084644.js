import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index'
import { generateOrderId } from '@/hooks/useGenerateOrderId'
import { generateSign } from '@/hooks/useMD5'
import { getOrdersList, setOrdersList } from '@/hooks/useLocalStorageOrders'
import dayjs from 'dayjs'
import { message } from 'ant-design-vue';

export const useHomeStore = defineStore('home', {
  state: () => {
    return {
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
      // 当前订单数据
      ordersData: {},
      // 支付信息
      paymentInfo: {},
      // 订单弹窗是否打开
      payModelIsShow: false,
      // 计时器
      timer:null,
      // 订单状态
      orderStatus:1
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
        const {money, out_trade_no, qrcode, urlscheme, msg} = {...result}
        console.log(result)
        // 本地存储订单
        // newData.trade_no = result.trade_no
        // newData.qrcode = result.qrcode
        // newData.urlscheme = result.urlscheme
        // newData.actualPaymentAmount = result.money
        // this.localStorageOrdersList(newData)

        // // 打开支付弹窗
        // this.payModelIsShow = true
      } catch (error) {
        console.error(error)
      }
    },
    // 整理数据
    organizingTheData(data) {
      // 添加支付方式
      data.type = this.paymentMethods.filter((item, index) => {
        return item.state == 1
      })[0].type

      return data
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
      // 整理当前支付信息
      this.paymentInfo = this.paymentMethods.filter((item, index) => {
        return item.type == ordersData.type;
      })[0];

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
    // 查询订单状态
    queryOrderStatus(){
      this.timer = setInterval(async()=>{
        try {
          let result = await api.queryOrderStatus(dayjs().unix(),{order_id:this.ordersData.trade_no})
          const { data } = {...result}
          console.log(data)
          if(data.status == 3){ // 商家关闭订单
            this.orderStatus = data.status
            message.warning('订单已关闭，感谢您的支持')
            clearInterval(this.timer)
          }else if(data.status == 4){ // 支付超时
            this.orderStatus = data.status
            message.warning('订单支付超时')
            clearInterval(this.timer)
          }
        } catch (error) {
          clearInterval(this.timer)
          console.error(error)
        }
      },1000)
    }
    // async postNotifyUrl(data) {
    //   data = JSON.parse(data)
    //   // 删除多余数据
    //   delete data.qrcode
    //   delete data.orderCreationTime
    //   delete data.actualPaymentAmount
    //   // 添加数据
    //   data.pid = this.unifiedOrderPaymentData.pid
    //   data.trade_status = 'TRADE_SUCCESS'
    //   data.sign_type = 'MD5'
    //   data.sign = generateSign(data, this.privateKey)
    //   console.log(data)
    //   let result = await api.notifyUrl(data)
    //   console.log(result)
    // }
  }
})
