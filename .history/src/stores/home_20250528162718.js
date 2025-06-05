import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index'
import { generateOrderId } from '@/hooks/useGenerateOrderId'
import { generateSignedString, signString } from '@/hooks/useRSA'
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
        device:'', // 设备类型
        param: '', // 业务扩展参数
        channel_id:'', // 支付渠道ID
        sign: '', // 签名字符串
        sign_type: 'RSA' // 签名类型
      },
      // 平台公钥
      platformPublicKey: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAs+HvQbhDdmJCxdlgbRRZHL9b7X3HiHg9LM3/qXR14F2wUysq7Mvrk58vNZezvatjhxIES9/21bCsjz4M8nbqvuvgwkV3BeB4url82JFSzAEGvGf09tHl/bZeZdbbre/9hmEAKvOLzXByYYa1jijQ/ncl/BfjdndroIYZcRVWKQGlTiTbc/MK55cxPGWISsterIHAsJC/5GRa4UJUTabSF5Nip0HRd2AJZTnECQAOpzLaMtsGRTQKHKq9fuQbrRiFmf8U6eezDPRR9zcSR2qKDLvqZZjRmWFzHDRsScwLL8ZNO3pa7RFP3+LHLKd/l07B6zWO+EbjQubnqx9PEWq22wIDAQAB
-----END PUBLIC KEY-----`,
      // 商户公钥
      privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDLQbsT2IrZspUkHtDMqKc8pIqIKP3nHgLh5ekUU52OG+bgBKAzerEFpyhKz0p39qdUkNc2iQA5DpehGOlORXEUkBpb4t431pJnlg7WLBq37M2AJb168OJM9SivtrforsPaANSOq4U1U3YPj8l7gWNiKSk8bMxF8rslA4FTn4tw0E9iEzczEl8dH+XKmZCYMc0QJ/8uvkwAy/hpAy5/NNeY+tKzjDoEAULlU0h//pllr7uOmPa+5E6s9092nu7RqDNSKOGNR3LfbBhH4jZBQvafayZxoxeLaihccW5HFyOVRofy6JEvz5EsH+0Ple+tblXv+Z+gxvHn/MJSRFn5XGmnAgMBAAECggEAQSqt5EsFGY8cKhyHLVbVZ6gJkmYyIauJmQuxkwbL+QgRGbnh8x9fKkTRskqLwbKfK4nUtnNuUtzO2KO4CZRSERmymcs/G//7qKJ/10MEvft6V5/CBGy+4ZWomc2nYT7HJFonzCZJ6zL7IzoiiyqMxqgTxH/Nbo/IWLGrATih6GUOcvdZDBiAJVvqxkJrAp8tje22mNrV8pPHnv8mQYR4LHRq2+0q5vWgOLdBKpodzFoa+KT4vMsocn0U3kaRYcwYH50nHG/ZXhAcPIB+1nsBjALWDBOmw2xPrSEnIIf8GJ6ly3OAt1YCsru12eoP/jnpKp7nRDi2olbf2CRy5byowQKBgQD5d0ul0pg0/ZScDCdVSzIfVopIQTMAUGIvyWtx+nrWJcz2aM2qfjkgtKq+eZylSVpuUIcY/UkYSurscnaj/NRTB0oS48UXQB7tAuGkSTMEtI1+2/6kpLEVeXSALNNt+NVB7bckRZO1NTQM5oWuxrDQoYqew9/FdNcttqQfgWFOiQKBgQDQlJiKEtMy32jIYJHksAxlY+bbpGB5F4/qaThyMN7s6+9X1CAXfTK5lAiSMIvcJvVaRQoZxm6nhf7Yt4FuWqIk3WXp4pbm1Ql/hfSv53hhubBCFbHdZX3S+pCwSYwe3oqJfctG3inNh7rLFmY+8s2cQO70vSDv+3x+1fT9FftqrwKBgA4RnEKNzeevJWJnjRBSXVFHICVTB/1Miz0GrviOl77cAuMipfanh7FAfyCe2ya3LFJsWDIglq64CueqzOYSrCbCknrePY9CHnxfXTpWpnntdM1iusmuQA5l+xv/ay0Yi25caaeyBNKDXZwcpA1nRzF86sRpZ4VLQZdiZX8hXMuBAoGAMsXJL+sPMBYD+qrPOLzF97RO0O59cVyT8rq0O8+7pC52b4m6Wh1myJfJUlSw5uEw3k1p/QY5j1vlwjlBL2yuhYzDLyCyHPSEwF8KRftxaVB7IEsJpdv7uey2ZcMxcZ44WOmfHtwbjuVYSfFk6DPQaxW/VSHor6InFvTcEvNT5Q8CgYA4YbcCQeVQXBLdUUnJ2+DOod09DLY+sxYP3LfAo3S/GzQ2Q/VSUandB0l7KlbClsLZxJOzD6Y1tAD2PpiYD0XUO4ho2YZ1o07f9usToKvVoDAf7pH30mefaoLCvksk1PGb6fByYRYOWkYbAP5lERe11gcxNykFehIxPHusipcSBA==
-----END PRIVATE KEY-----`,
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
    // API支付
    async paymentViaAPI(data) {
      let newData = this.organizingTheData(data)
      console.log(newData)
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
      data.type = this.paymentMethods.filter((item, index) => {
        return item.state == 1
      })[0].type
      // // 添加异步通知地址
      // data.notify_url = 'http://www.pay.com/notify_url.php'
      // // 添加跳转通知地址
      // data.return_url = 'http://www.pay.com/return_url.php'

      // 生成待签名字符串
      let queryString = generateSignedString(data)
      // let queryString2 = getSignContent(data)
      // console.log(queryString2)


      let result = Object.assign(this.unifiedOrderPaymentData, data)

      // 使用 RSA 私钥对待签名字符串进行签名
      result.sign = signString(this.privateKey, this.platformPublicKey, queryString);
      // result.sign = queryString1;
      // 添加时间戳
      result.timestamp = dayjs().unix().toString()

      return result
    }
  }
})
