import { createApp } from 'vue'
import './style.css'

import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import '@/assets/icon/iconfont.css'
import Request from '@/utils/request'
import Message from '@/utils/Message'


const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.Request = Request
app.config.globalProperties.message = Message
app.mount('#app')
