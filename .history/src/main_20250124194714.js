import './assets/main.css'
import Jsrsasign from 'jsrsasign'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'

const app = createApp(App)
app.prototype.$jsrsasign = Jsrsasign

import 'ant-design-vue/dist/reset.css';

app.use(createPinia())

app.mount('#app')
