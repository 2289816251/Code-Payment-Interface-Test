import './assets/main.css'
import JsEncrypt from 'jsencrypt'
Vue.prototype.$jsEncrypt = JsEncrypt
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)

import 'ant-design-vue/dist/reset.css';

app.use(createPinia())

app.mount('#app')
