<template>
  <div class="box">
    <!-- 新增修改弹框 -->
    <Window
      :show="windowConfig.show"
      :buttons="windowConfig.buttons"
      @close="closeWindow"
    >
      <el-form ref="blogFormDataRef" :model="blogFormData" :rules="rules">
        <!-- label-width="100px" styrulesle="max-width: 460px"-->
        <el-form-item prop="title">
          <div class="input-title">
            <el-input placeholder="请输入博客标题" v-model="blogFormData.title">
            </el-input>
          </div>
        </el-form-item>
        <el-form-item prop="content">
          <div class="markdown-content">
            <EditorMarkdown
              v-model="blogFormData.markdownContent"
              :height="markdownHeight"
              @htmlContent="setHtmlContent"
              v-if="blogFormData.editorType == 1"
            ></EditorMarkdown>
            <EditorHtml
              v-else
              v-model="blogFormData.content"
              :height="editorHtmlHeight"
            ></EditorHtml>
            <!-- {{blogFormData.content}} -->
          </div>
        </el-form-item>
      </el-form>
    </Window>
  </div>
</template>

<script setup>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  onMounted,
  onUnmounted,
  nextTick,
  ref,
} from 'vue'
const markdownHeight = window.innerHeight - 60 - 10 - 30 - 50 - 40 - 60
const editorHtmlHeight = window.innerHeight - 60 - 10 - 30 - 50 - 160 - 60
const api = {
  saveBlog: '/blog/saveBlog4Special',
  getUserInfo: '/getUserInfo',
  getBlogById: '/blog/getBlogById',
  autoSaveBlog: '/blog/autoSaveBlog4Special',
}
const { proxy } = getCurrentInstance()
const windowConfig = reactive({
  show: false,
  buttons: [
    {
      type: 'danger',
      text: '确定',
      click: () => {
        submitBlog()
      },
    },
  ],
})
const emit = defineEmits()
// 关闭 刷新table
const closeWindow = () => {
  windowConfig.show = false
  emit('callback')
  // 关闭窗口清除定时器
  if (timer.value !== null) {
    clearTimer()
  }
}
const init = (type, data) => {
  startTimer()
  windowConfig.show = true
  nextTick(() => {
    blogFormDataRef.value.resetFields()
    // 添加专题时 需要知道当前层级的id pBlogId就是添加层级的父级
    blogFormData.value = { categoryId: data.categoryId, pBlogId: data.blogId }
    if (type === 'add') {
      // 新增 需要获取当前用户编辑器的情况 是markdown 还是富文本
      getUserInfo()
    } else {
      // 修改- 重新发请求 那数据
      getBlogDetail(data)
    }
  })
}
defineExpose({ init })
const getUserInfo = async () => {
  let res = await proxy.Request({
    url: api.getUserInfo,
  })
  if (!res) {
    return
  }
  blogFormData.value.editorType = res.data.editorType
}
// 修改场景数据
const getBlogDetail = async (data) => {
  let res = await proxy.Request({
    url: api.getBlogById,
    params: {
      blogId: data.blogId,
    },
  })
  if (!res) {
    return
  }
  blogFormData.value = { ...res.data }
  if (res.data.tag) {
    blogFormData.value.tagList = res.data.tag.split('|')
  } else {
    blogFormData.value.tagList = []
  }
  // blogFormData.value.editorType = res.data.editorType
}
// 设置定时器
let timer = ref(null)
const startTimer = () => {
  timer.value = setInterval(() => {
    autoSave()
  }, 5000)
}
// 关闭清除定时器
const clearTimer = () => {
  if (timer.value !== null) {
    clearInterval(timer.value)
    timer.value = null
  }
}
//自动保存
const autoSave = async () => {
  // 判断内容和标题 没有不需要保存
  if (
    (blogFormData.value.title == ''|| blogFormData.value.content == '') ||
    timer.value == null 
  ) {
    return
  }
  const params = {}
  Object.assign(params, blogFormData.value)
  if (params.tagList) {
    params.tag = params.tagList.join('|')
  } else {
    params.tag = ''
  }
  let res = await proxy.Request({
    url: api.autoSaveBlog,
    showLoading: false,
    params,
  })
  if (!res) {
    return
  }
  blogFormData.value.blogId = res.data
}

// 表单相关
const blogFormDataRef = ref()
const blogFormData = ref({ tagList: [] })
const rules = {
  title: [
    {
      required: true,
      message: '请输入博客标题',
    },
  ],
  content: [
    {
      required: true,
      message: '请输入正文',
    },
  ],
  categoryId: [{ required: true, message: '请选择博客分类' }],
  type: [{ required: true, message: '请选择博客类型' }],
  allowComment: [{ required: true, message: '请选择是否允许评论' }],
  reprintUrl: [{ required: true, message: '请输入原文地址' }],
}
//markdown 设置编辑器内容
const setHtmlContent = (html) => {
  blogFormData.value.content = html
}
onMounted(() => {
  // loadCategoryList()
})
onUnmounted(() => {
  clearTimer()
})

// 提交
const submitBlog = () => {
  blogFormDataRef.value.validate(async(valid) => {
    if (!valid) {
      return
    }
    let params = Object.assign({}, blogFormData.value);
    let result = await proxy.Request({
      url: api.saveBlog,
      params
    })
    if (!result) {
      return;
    }
    proxy.Message.success("保存博客成功");
    closeWindow();
  })
}

</script>

<style lang="scss">
.input-title {
  width: 100%;

  border-bottom: 1px solid #ddd;
  .el-input__wrapper {
    box-shadow: none !important;
  }
  input {
    font-size: 18px;
  }
}
.markdown-content {
  width: 100%;
}
</style>
