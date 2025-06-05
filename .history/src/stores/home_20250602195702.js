import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index'
import dayjs from 'dayjs'
import { getToken, setToken } from '@/hooks/useLocalToken'
import { generateCreativeUUID } from '@/hooks/useToken'
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
      // 历史订单列表
      historicalOrderList:[],
      // 当前订单数据
      ordersData: {},
      // 支付信息
      paymentInfo: {},
      // 订单弹窗是否打开
      payModelIsShow: false,
      // 订单数据列表是否打开
      OrderDataListDrawerIsShow: false,
      // 计时器
      timer: null,
      // 当前订单状态
      orderStatus: 1,
      token: ''
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
        const { trade_no, money, out_trade_no, qrcode, urlscheme, time, msg } = { ...result }
        // 保存当前订单数据
        this.ordersData = Object.assign({}, data, { trade_no, money, out_trade_no, qrcode, urlscheme, time });
        // 整理当前支付信息
        this.paymentInfo = this.paymentMethods.filter((item, index) => {
          return item.type == this.ordersData.type;
        })[0];
        // 打开支付弹窗
        this.payModelIsShow = true
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

      data.uid = this.token

      return data
    },
    // 查询订单状态
    queryOrderStatus() {
      this.timer = setInterval(async () => {
        try {
          let result = await api.queryOrderStatus(dayjs().unix(), { order_id: this.ordersData.trade_no })
          const { data } = { ...result }
          console.log(data)
          if (data.status == 1) {
            return
          } else {
            if (data.status == 2) { // 支付成功
              this.orderStatus = data.status
              message.success('支付成功，感谢您的支持')
            } else if (data.status == 3) { // 商家关闭订单
              this.orderStatus = data.status
              message.warning('订单已关闭，感谢您的支持')
            } else if (data.status == 4) { // 支付超时
              this.orderStatus = data.status
              message.warning('订单支付超时')
            }

            clearInterval(this.timer)
          }
        } catch (error) {
          clearInterval(this.timer)
          console.error(error)
        }
      }, 1000)
    },
    // 获取订单数据
    async getOrderDataList(){
      try {
        let result = await api.getOrderDataList(this.token)
        const { code, msg, data } = {...result}
        if(code == 200){
          this.historicalOrderList = data
        }else{
          message.warning(msg)
        }
      } catch (error) {
        message.error(error)
      }
    },
    // 关闭窗口
    closeModel() {
      this.payModelIsShow = false
      clearInterval(this.timer)
    },
    init() {
      if (getToken()) {
        this.token = getToken()
      } else {
        setToken(generateCreativeUUID())
        this.token = getToken()
      }
      // 获取订单数据
      this.getOrderDataList()
    }
  }
})