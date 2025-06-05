import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api/index'

export const useHomeStore = defineStore('home', {
  state:()=>{
    return{

    }
  },
  actions:{
    // 统一支付
    unifiedOrderPayment(){
      console.log(api)
    }
  }
})
