import { createRouter, createWebHistory } from 'vue-router'
import VueCookies from 'vue-cookies'
const routes = [
  {
    name: "首页",
    path: "/login",
    component: () => import('../views/Login.vue')
  },
  {
    name: "框架页",
    path: "/",
    component: () => import('../views/Framework.vue'),
    redirect:'/blog/list',
    children: [
      {
        name: "博客",
        path: "/blog/list",
        component: () => import('../views/blog/Blog.vue')
      },
      {
        name: "博客列表",
        path: "/blog/category",
        component: () => import('../views/blog/BlogCategary.vue')
      }
    ]
  },
]
// 这里不是通过new来创建的， 通过createRouter 方法创建， 使用的模式不是通过莫得来定义
const router = createRouter({
  routes,
  history: createWebHistory()
})
router.beforeEach((to, from, next) => {
  const cookies = VueCookies.get('userInfo')
  if (!cookies && to.path != '/login') {
    router.push('/login')
  }
  next();
})
export default router