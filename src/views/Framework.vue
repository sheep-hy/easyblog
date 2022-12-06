<template>
  <div class="common-layout">
    <el-container class="header">
      <el-header>Header</el-header>
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
                    <span class="sub-menu-title">{{ subMenu.title }}</span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </el-aside>
        <el-main class="right-main">Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'
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
</script>

<style lang="scss" scoped>
.common-layout {
  height: 100%;
  display: flex;
  .header {
    height: 60px;
    border-bottom: 1px solid #ddd;
  }
  .container {
    flex: 1;
    background-color: #f5f6f7;
    padding-top: 10px;
    .left-aside {
      padding: 0 15px;
      width: 250px;
      height: calc(100vh - 60px);
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
          font-size:16px;
        }
        .menu-title {
          margin-left: 8px;
          color: #3f4042;
          flex: 1;
        }
        .up-dowm {
          width: 20px;
          font-size:14px;
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
        }
        .sub-menu-title:hover {
          background-color: #ddd;
        }
      }
    }
    .right-main {
      background-color: #fff;
      border: 1px solid red;
    }
  }
}
</style>
