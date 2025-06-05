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
    // 统一支付
    async unifiedOrderPayment(data) {
      let newData = this.organizingTheData(data)
      console.log(newData)
      let result = await api.getUnifiedOrderPayment(newData)
      console.log(result)
    },
    organizingTheData(data) {
      // 删除数量
      delete data.number
      // 添加订单号
      data.out_trade_no = generateOrderId()
      // 添加时间戳
      data.timestamp = dayjs().unix().toString()
      // 添加支付方式
      data.type = this.paymentMethods.filter((item, index) => {
        return item.state == 1
      })[0].type

      let result = Object.assign(this.unifiedOrderPaymentData, data)

      // RSA
      // 生成待签名字符串
      let queryString = generateSignedString(result)
      // 使用 RSA 私钥对待签名字符串进行签名
      result.sign = signString(this.privateKey, queryString);

      return result
    }
  }
})
