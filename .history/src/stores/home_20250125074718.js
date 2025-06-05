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
      privateKey: `-----BEGIN PUBLIC KEY-----
      MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/teaoKtNfYKptOTGqGMEkzVcxI4OUvA0XvmajMDjoioUHX7stEwfLEnU8wHzijT7qQJymh0x7xf2h8hmIZ2e48PSLw/mZWf24iiZOt5F5ln2un37ULrvq2r2VI0vg5oMikkVftI0JI/eX+Y80G/8s0MqZ5AGFYKiVkXKR7SVftsaIp2jgvOkni/Qt4VJ+nrPCAWwbjQzzMLas2K/2ozF4Zas2krHHjvdfha02XrXoRIORPOFXqFPa+PMODJZklOgGfoX32xipfrOTs9Scc4FXV/hsaLuR5TSFkHAUXxUqLQR64zaxukUoth8PLCsLMh/GQnzTuOxuI++C6y32Ke6JAgMBAAECggEAW/Caq+/N6yHq2fLh9JdmmYW42SIVCpGdHdP8WSrZP/yei8jHdXh49lTl0Lrnqabfk2xlNCAS+BEd8DqxMA+XWMSGIzlbTMYxvfzTHlE+/TbFE6f+JTg8ewdogEurKjKilUPc7WcjdEzBgyr2GKGMoSuI3oDQkeynLQPSFFXM5LdnCx7BANYeeOrwJqjSG+977Q7p/woSk4250y+LaTGwVO+f5MxziaW6bNw/DhzSNCZ20EArvRUUPf5EpPUbtWi43yN+DSi6PNkx0e5vS2SoufRSH2NFghJHebWk3eZ9FxNDXOw/5PCf+ksqrM+J06KvAYpCYW/dNT6mibXmiUOiYQKBgQD7qhbhY7NO1+/hdIP+pFWdsRJFoc0jWUcarG3d24X8zDZB5z8PNAzX+raiDxx3DOnac3tWK+Qzy1LreMBtqX7LbVJrQhlcivK4SSmGT4aixE6+J8YpPf1T7d4XbIK8Y9iWqp4sStLbu0hjzM7hBrsv4rUmKOEIl1IX9yvC03q1LQKBgQDDA2X2R/zSFH9YSVAX+usC+Ds/1vpMsoZG6SChZG1bdFOZ8ujmLfpHQEOyujagyRI124MeqxEu6LX9IZcnU10FQXJe1IXGkJUlxEp4kys6K0JXHtBv+iYPgiK6PM6W/YzzyEpo5Dx85ywKqF8oRVxH986ITlRXdS11q+772Q0wTQKBgQCPeK5GnEIy5qQY0gYV+7XbioEyNUXvqwwARuDzpBzEu98KvzyR/Eh+MK5BwX+m1zPSmBduTuNwK7AAEf0SB5kDfDWKdEplGcm6CeukaF4HGQcTHTW5eV+co3UDwZbes8VcT7SQ569CGYjxbGdcnivE5ugC8zcnYK0qgHzwOwQvmQKBgFd027JCgIh6ds3SOyA2AFVZm8C6mY/x9DQy8tZOYpjEJ4YAISCxd++iS3oI9tzOr+MFad1EHLWr2YoHGXGiejIUMsWCi+gMCUdhq4A9iAJTSjIl+JZvWchUtVxOTtv6I89kgLJfwRzG08KH1f0KdiM0aCRK9JowS83c6JV7tuV1AoGBANhGMTKR0TJqLGhreAQW+lJg2Bbzss8VUakzKcONHHSEoeK+9DAjqAbDfjFIH+xOlv2EKDz1oL5PN8UDSlCpVSq1k2AMcESnBTnNdDB1+INhDHIOo38x3C7F46woFgJwgBid3ReZUJlarW5BZiiGTA2AP4NoPR4Gsmz9l7vup5Cq
      -----BEGIN PUBLIC KEY-----`,
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
      // let result = await api.getUnifiedOrderPayment(newData)
      // console.log(result)
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
