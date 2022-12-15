<template>
  <div>
    <Window
      :show="windowConfig.show"
      :buttons="windowConfig.buttons"
      :showCancel="false"
      @close="closeWindow"
    >
      <el-row :gutter="5">
        <el-col :span="14">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>专题</span>
              </div>
            </template>
            <el-tree
              class="tree-panel"
              ref="refTree"
              :data="blogList"
              defaultExpandAll
              node-key="blogId"
              :expand-on-click-node="false"
              :props="treeProps"
              :highlight-current="true"
              @node-click="treeNodeClick"
            >
              <template #default="{ node, data }">
                <span class="custom-node-style">
                  <span class="node-title">
                    <span
                      v-if="data.status == 0"
                      :style="{ color: 'red', 'font-size': '13px' }"
                    >
                      {{ data.title }}</span
                    >
                    <span
                      v-else
                      :style="{ color: 'green', 'font-size': '13px' }"
                    >
                      {{ data.title }}</span
                    >
                  </span>
                </span>
              </template>
            </el-tree>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="box-card">
            <template #header>
              <div class="card-header">
                <span>专题文章</span>
                <!-- <el-button class="button" text>Operation button</el-button> -->
              </div>
            </template>
            <div v-if="blog.title">
              <div class="my-title">{{ blog.title }}</div>
            <div v-html="blog.content" class="blog-detail"></div>
            </div>
            <div v-else
                 class="no-data">
              请选择专题文章，查看详情
            </div>
          </el-card>
        </el-col>
      </el-row>
    </Window>
  </div>
</template>

<script setup>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  nextTick,
} from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css' //样式
const api = {
  getBlogById: '/blog/getBlogById',
  getSpecialInfo: '/blog/getSpecialInfo',
}
const { proxy } = getCurrentInstance()
const windowConfig = reactive({
  show: false,
  buttons: [],
})
const closeWindow = () => {
  windowConfig.show = false
}
const currentBlogId = ref(null)
const blog = ref({})
const showDetail = async (data) => {
  currentBlogId.value = data.blogId
  windowConfig.show = true
  //获取所有文章树
  getSpecialInfo(data.categoryId)
  //获取选择节点的详情
  getNodeTreeDetail(data.blogId)
}
defineExpose({ showDetail })
//获取选择节点的详情
const getNodeTreeDetail = async (blogId) => {
  const result = await proxy.Request({
    url: api.getBlogById,
    params: {
      blogId: blogId,
    },
  })
  if (!result) {
    return
  }
  blog.value = result.data
  nextTick(() => {
    //高亮显示
    let blocks = document.querySelectorAll('pre code')
    blocks.forEach((block) => {
      hljs.highlightBlock(block)
    })
  })
}
// 获取树形结构数据
const blogList = ref([])
const refTree = ref(null)
const getSpecialInfo = async (categoryId) => {
  const res = await proxy.Request({
    url: api.getSpecialInfo,
    params: {
      categoryId: categoryId,
      showType: '1',
    },
  })
  if (!res) {
    return
  }
  blogList.value = res.data
  nextTick(() => {
    refTree.value.setCurrentKey(currentBlogId.value)
  })
}
const treeNodeClick = (node) => {
  // 第一层级点击的时候 是不展示详情的 清空blog里面的数据
  if (node.blogId == "0") {
    blog.value = {};
    return;
  }
  currentBlogId.value = node.blogId
  getNodeTreeDetail(node.blogId)
}
// 属性展示
const treeProps = {
  children: 'children',
  label: 'title',
  value: 'blogId',
}
</script>

<style lang="scss" scoped>
.my-title {
  font-size: 18px;
}

.blog-detail {
  blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
  }

  img {
    max-width: 80%;
  }
}
</style>
