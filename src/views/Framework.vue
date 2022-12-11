<template>
  <div class="common-layout">
    <el-container>
      <el-header class="header">
        <div class="logo">easyblog</div>
        <div class="user-info">
          欢迎回来,
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userInfo.nickName }}
              <span :class="['iconfont', 'icon-arrow-down']"></span>
              <!-- <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon> -->
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <div class="avatar"><img :src="userInfo.avatar" /></div>
        </div>
      </el-header>
      <el-container class="container">
        <el-aside class="left-aside">
          <div>
            <el-button class="post-btn">发布</el-button>
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
                    <!-- <span class="sub-menu-title">{{ subMenu.title }}</span> -->
                    <RouterLink
                      :to="subMenu.path"
                      :class="[
                        'sub-menu-title',
                        activePath === subMenu.path ? 'active' : '',
                      ]"
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
  </div>
</template>

<script setup>
import VueCookies from 'vue-cookies'
import { defineComponent, getCurrentInstance, reactive, ref, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
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
        path: '/special/category',
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
        path: '/setting/my',
      },
      {
        title: '博客成员',
        path: '/setting/user',
      },
      {
        title: '系统设置',
        path: '/setting/sysSetting',
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
const init = () => {
  userInfo.value = VueCookies.get('userInfo')
  userInfo.value.avatar = proxy.globalInfo.imgUrl + userInfo.value.avatar
  console.log(userInfo.value, '个人信息')
}
init()
const handleCommand = () => {}
const activePath = ref(null)

watch(
  route,
  (newval, oldval) => {
    activePath.value = newval.path
  },
  { immediate: true, deep: true }
)
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
</style>
