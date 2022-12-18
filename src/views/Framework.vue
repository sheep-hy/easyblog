<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div class="logo">EasyBlog</div>
        <div class="user-info">
          欢迎回来,
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userInfo.nickName }}
              <span :class="['iconfont', true ? 'icon-arrow-down' : '']"></span>
              <!-- <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon> -->
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goUserInfo">
                  <!-- <router-link class="a-router" to="../settings/my">个人信息</router-link> -->
                  <span class="a-lick">个人信息</span>
                </el-dropdown-item>
                <el-dropdown-item @click="lagout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="avatar"><img :src="userInfo.avatar" /></div>
        </div>
      </el-header>
      <el-container class="container">
        <el-aside class="left-aside">
          <div>
            <el-button class="post-btn" @click="publish">发布</el-button>
          </div>
          <div>
            <ul class="menu-panel">
              <li v-for="(item, index) in menuList">
                <span class="menu" @click="handleOpenClose(index)">
                  <span :class="['iconfont', item.icon]"></span>
                  <span class="menu-title">{{ item.title }}</span>
                  <span
                    :class="[
                      'iconfont',
                      'up-dowm',
                      item.open ? 'icon-up' : 'icon-arrow-down',
                    ]"
                  ></span>
                </span>

                <ul class="sub-menu" v-show="item.open">
                  <li v-for="(subMenu, index) in item.children">
                    <!-- <subMenu.roleType==null||subMenu.roleType==userInfo.roleType 当前角色和用户角色一致 展示系统设置-->
                    <RouterLink
                      :to="subMenu.path"
                      :class="[
                        'sub-menu-title',
                        activePath === subMenu.path ? 'active' : '',
                      ]"
                      v-if="(subMenu.roleType==null||subMenu.roleType==userInfo.roleType)"
                      >{{ subMenu.title }}</RouterLink
                    >
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </el-aside>
        <el-main class="right-main"><RouterView></RouterView></el-main>
      </el-container>
    </el-container>
    <!-- // 发布 进步条 -->
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="false"
      :showClose="false"
      @close="dialogConfig.show = false"
      width="400"
    >
      <div class="progress-container">
        <div class="progress-panel">
          <el-progress
            type="circle"
            :percentage="progressInfo.progress"
            :status="progressInfo.status"
            :color="colors"
          />
        </div>
        <div class="error" v-if="progressInfo.result == 0">
          <div>页面出错了，{{ progressInfo.errorMsg }}</div>
          <div class="info">具体错误，请查看服务器日志</div>
        </div>
        <div
          v-if="progressInfo.progress == 100 && progressInfo.result == 1"
          class="success"
        >
          发布成功
        </div>
        <div
          class="btn-panel"
          v-if="progressInfo.progress == 100 || progressInfo.result == 0"
        >
          <el-button
            class="btn"
            type="primary"
            @click="dialogConfig.show = false"
            >关闭</el-button
          >
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
// import VueCookies from 'vue-cookies'
import { defineComponent, getCurrentInstance, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
const store = useStore()
const router = useRouter()
const route = useRoute()
const api = {
  getUserInfo: '/getUserInfo',
  logout: '/logout',
  createHtml: '/createHtml',
  checkProgress: '/checkProgress',
}
const { proxy } = getCurrentInstance()
// const userInfo = ref(proxy.VueCookies.get('userInfo') || {})
const menuList = ref([
  {
    title: '博客',
    icon: 'icon-blog',
    open: true,
    children: [
      {
        title: '博客管理',
        path: '/blog/list',
      },
      {
        title: '分类管理',
        path: '/blog/category',
      },
    ],
  },
  {
    title: '专题',
    icon: 'icon-zhuanti',
    open: true,
    children: [
      {
        title: '专题管理',
        path: '/special/speciallist',
      },
    ],
  },
  {
    title: '设置',
    icon: 'icon-settings',
    open: true,
    children: [
      {
        title: '个人信息设置',
        path: '/settings/my',
      },
      {
        title: '博客成员',
        path: '/settings/user',
      },
      {
        title: '系统设置',
        path: '/settings/sysSetting',
        roleType: 1,
      },
    ],
  },
  {
    title: '回收站',
    icon: 'icon-delete',
    open: true,
    children: [
      {
        title: '回收站',
        path: '/recovery/list',
      },
    ],
  },
])
const handleOpenClose = (i) => {
  const status = menuList.value[i].open
  menuList.value[i].open = !status
}
const userInfo = ref({})
const init = async () => {
  const res = await proxy.Request({
    url: api.getUserInfo,
  })
  if (!res) {
    return
  }
  userInfo.value = res.data
  // userInfo.value = VueCookies.get('userInfo')
  userInfo.value.avatar = proxy.globalInfo.imgUrl + userInfo.value.avatar
  // console.log(userInfo.value, '个人信息')
}
init()
const handleCommand = () => {}
const activePath = ref(null)
const goUserInfo = () => {
  router.push('../settings/my')
}
// 退出登录
const lagout = () => {
  proxy.Confirm('你确定要退出吗', async () => {
    const res = await proxy.Request({
      url: api.logout,
    })
    if (!res) {
      return
    }
    router.push('/login')
  })
}
watch(
  route,
  (newval, oldval) => {
    activePath.value = newval.path
  },
  { immediate: true, deep: true }
)
// 监听store
const { user } = store.state
watch(
  () => user.userInfo,
  (newval, oldval) => {
    // console.log(newval,'------------------newval')
    const avatar = proxy.globalInfo.imgUrl + newval.avatar
    const nickName = newval.nickName
    userInfo.value = { avatar, nickName }
  },
  { immediate: true, deep: true }
)
// 发布
const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
]
const dialogConfig = reactive({
  show: false,
  title: '发布',
})
const progressInfo = reactive({
  progress: 0,
})
let checkTimer = null
const publish = async () => {
  dialogConfig.show = true
  progressInfo.progress = 0
  progressInfo.status = undefined
  let result = await proxy.Request({
    url: api.createHtml,
  })
  if (!result) {
    return
  }
  checkProgress()
  checkTimer = setInterval(() => {
    checkProgress()
  }, 1000)
}
const checkProgress = async () => {
  let result = await proxy.Request({
    url: api.checkProgress,
    showLoading: false,
  })
  if (!result) {
    return
  }
  if (result.data.result == 0) {
    progressInfo.status = 'exception'
    progressInfo.errorMsg = result.data.errorMsg
  } else {
    progressInfo.progress = result.data.progress
  }
  progressInfo.result = result.data.result
  if (
    (result.data.progress == 100 || result.data.result == 0) &&
    checkTimer != null
  ) {
    clearInterval(checkTimer)
  }
}
</script>

<style lang="scss" scoped>
.common-layout {
  height: 100%;
  display: flex;
  .header {
    height: 60px;
    border-bottom: 1px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .logo {
      flex: 1;
      font-size: 30px;
    }
    .user-info {
      display: flex;
      align-items: center;
      .el-dropdown-link {
        cursor: pointer;
        color: rgb(5, 195, 253);
        .icon-arrow-down {
          font-size: 14px;
        }
      }
    }
    .avatar {
      margin-left: 8px;
      width: 50px;
      img {
        border-radius: 25px;
        width: 100%;
      }
    }
  }
  .container {
    flex: 1;
    background-color: #f5f6f7;
    padding-top: 10px;
    .left-aside {
      padding: 0 15px;
      width: 250px;
      height: calc(100vh - 80px);
      .post-btn {
        background: green;
        color: #fff;
        height: 40px;
        width: 100%;
      }
      .menu-panel {
        margin-top: 5px;
      }
      .menu {
        padding: 0 5px;
        display: flex;
        cursor: pointer;
        line-height: 40px;
        .iconfont {
          color: #91949a;
          font-size: 16px;
        }
        .menu-title {
          margin-left: 8px;
          color: #3f4042;
          flex: 1;
        }
        .up-dowm {
          width: 20px;
          font-size: 14px;
        }
      }
      .menu:hover {
        background-color: #ddd;
      }
      .sub-menu {
        margin-left: 18px;
        font-size: 14px;
        .sub-menu-title {
          line-height: 30px;
          display: block;
          padding: 0 10px;
          text-decoration: none;
          color: #3f4042;
        }
        .active {
          background-color: #ddd;
        }
        .sub-menu-title:hover {
          background-color: #ddd;
        }
      }
    }
    .right-main {
      background-color: #fff;
      position: relative;
      // border:1px solid red;
      height: calc(100vh - 80px);
    }
  }
}
.progress-container {
  .progress-panel {
    display: flex;
    justify-content: center;
  }
  .error {
    color: red;
    margin-top: 10px;
    text-align: center;
    .info {
      font-size: 13px;
    }
  }
  .success {
    margin-top: 10px;
    text-align: center;
    font-size: 16px;
    color: green;
  }
  .btn-panel {
    text-align: center;
    margin-top: 10px;
    .btn {
      margin: 0 auto;
    }
  }
}
</style>
