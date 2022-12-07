import { createApp } from 'vue'
import './style.css'

import router from '@/router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import '@/assets/icon/iconfont.css'
import Request from '@/utils/request'
import Message from '@/utils/Message'
import Table from '@/components/Table.vue'
import Cover from '@/components/Cover.vue'
import Dialog from '@/components/Dialog.vue'


const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.config.globalProperties.Request = Request
app.config.globalProperties.message = Message
app.config.globalProperties.globalInfo = {
  imgUrl:'/api/file/getImage/'
}
app.component('Table',Table)
app.component('Cover',Cover)
app.component('Dialog',Dialog)
app.mount('#app')
