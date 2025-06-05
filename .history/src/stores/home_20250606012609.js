import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index'
import dayjs from 'dayjs'
import { getToken, setToken } from '@/hooks/useLocalToken'
import { generateCreativeUUID } from '@/hooks/useToken'
import { filterMatchingKeys } from '@/hooks/useTool'
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
      // 支付按钮loading状态
      payBtnLoading: false,
      // 订单弹窗是否打开
      payModelIsShow: false,
      // 订单数据列表是否打开
      OrderDataListDrawerIsShow: false,
      // 删除订单弹窗是否打开
      deleteOrderDataModelIsShow: false,
      // 需要删除的订单key
      deleteOrderDataAndKey: [],
      // 计时器
      timer: null,
      // 当前订单状态
      orderStatus: 1,
      // 用户token
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
      this.payBtnLoading = true
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
        // 关闭loading
        this.payBtnLoading = false
        // 打开支付弹窗
        this.payModelIsShow = true
      } catch (error) {
        // 关闭loading
        this.payBtnLoading = false
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
            // 修改订单状态
            this.updateOrderStatus(data.status)
            // 关闭计时器
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
          message.success(msg)
        }else{
          message.warning(msg)
        }
      } catch (error) {
        message.error(error)
      }
    },
    // 删除订单
    async deleteOrderDataByid(data){
      // 创建一个新数组
      let idList = new Array()
      data.forEach((item)=>{
        idList.push(item.id)
      })
      try {
        let result = await api.deleteOrderData({id:idList})
        const { code, msg } = {...result}
        if(code == 200){
          message.success(msg)
          // 重新获取订单数据
          this.getOrderDataList()
          this.deleteOrderDataModelIsShow = false
        }else{
          message.warning(msg)
        }
      } catch (error) {
        message.error(error)
      }
    },
    // 修改订单状态
    async updateOrderStatus(status){
      let data = {
        out_trade_no:this.ordersData.out_trade_no,
        uid:getToken(),
        status
      }
      try {
        // let result = await api.updateOrderStatus()
      } catch (error) {
        
      }
      console.log(data)
    },
    // 打开窗口
    openModel(modelTitle,event){
      // 如果打开的是删除订单确认窗口
      if(modelTitle == 'deleteOrderDataModelIsShow'){
        // 保存数据
        this.deleteOrderDataAndKey = filterMatchingKeys(event,this.historicalOrderList)
        // 打开窗口
        this[modelTitle] = true
        return
      }
      // 如果打开的是订单数据列表抽屉
      if(modelTitle == 'OrderDataListDrawerIsShow'){
        // 如果没有历史订单数据 则返回
        if(this.historicalOrderList.length <= 0) return message.warning('暂无订单记录')
        this[modelTitle] = true
        return
      }
      this[modelTitle] = true
    },
    // 关闭窗口
    closeModel(modelTitle) {
      this[modelTitle] = false
      // 如果是关闭订单窗口
      if(modelTitle == 'payModelIsShow') return clearInterval(this.timer)
    },
    // 初始化
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