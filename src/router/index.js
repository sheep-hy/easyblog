import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  {
    name: "首页",
    path: "/index",
    component: () => import('../views/Index.vue')
  }
]
// 这里不是通过new来创建的， 通过createRouter 方法创建， 使用的模式不是通过莫得来定义
const router = createRouter({
  routes,
  history: createWebHistory()
})
export default router