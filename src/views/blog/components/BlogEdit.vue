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

      <!-- <EditorHtml v-model="markdownContent"  :height="editorHtmlHeight"></EditorHtml> -->
      <!-- 、、点击确定时 回出现弹框 -->
      <Dialog
        :show="dialogConfig.show"
        :title="dialogConfig.title"
        :buttons="dialogConfig.buttons"
        @close="dialogConfig.show = false"
        width="700"
      >
        <el-form
          ref="settingFormDataRef"
          :model="blogFormData"
          label-position="right"
          :rules="rules"
          label-width="5rem"
        >
          <!-- label-width="6.25rem" styrulesle="max-width: 28.75rem"-->
          <el-form-item label="博客分类" prop="categoryName">
            <el-select
              placeholder="请选择分类"
              v-model="blogFormData.categoryId"
              :style="{ width: '100%' }"
            >
              <el-option :value="0" label="全部分类"></el-option>
              <el-option
                v-for="item in categoryList"
                :value="item.categoryId"
                :label="item.categoryName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="封面" prop="cover">
            <CoverUpload v-model="blogFormData.cover"></CoverUpload>
          </el-form-item>
          <el-form-item label="博客类型" prop="type">
            <el-radio-group v-model="blogFormData.type">
              <el-radio :label="0">原创</el-radio>
              <el-radio :label="1">转载</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item
            v-if="blogFormData.type == 1"
            label="原文地址"
            prop="reprintUrl"
          >
            <el-input
              placeholder="请输入原文地址"
              v-model="blogFormData.reprintUrl"
            >
            </el-input>
          </el-form-item>

          <el-form-item label="评论" prop="allowComment">
            <el-radio-group v-model="blogFormData.allowComment">
              <el-radio :label="1">允许</el-radio>
              <el-radio :label="0">不允许</el-radio>
              <!-- <el-radio :label="0" size="large">允许</el-radio>
              <el-radio :label="1" size="large">不允许</el-radio> -->
            </el-radio-group>
            <span style="margin-left: 20px; font-size: 12px"
              >请先在评论设置里设置相应参数，评论才会生效</span
            >
          </el-form-item>

          <el-form-item label="博客摘要" prop="summary">
            <el-input
              placeholder="请输入简介"
              type="textarea"
              v-model="blogFormData.summary"
              :autoSize="{ minRows: 4, maxRow: 4 }"
            >
            </el-input>
          </el-form-item>
          <el-form-item label="博客标签" prop="tag">
            <div class="tag-input-panel">
              <div class="tag-list">
                <el-tag
                  v-for="(item, index) in blogFormData.tagList"
                  :key="index"
                  closable
                  @close="closeTag(index)"
                  class="tag-item"
                  >{{ item }}</el-tag
                >
              </div>

              <span class="info" v-if="!blogFormData.tagList.length"
                >添加标签更容易被搜索引擎收录</span
              >
              <span
                v-if="!showTagInput"
                class="iconfont icon-tianjia"
                @click="addTag"
              ></span>
              <el-input
                v-if="showTagInput"
                v-model="tagInputValue"
                @blur="tagInputResult"
                @keyup.enter="tagInputResult"
              ></el-input>
            </div>
          </el-form-item>
        </el-form>
      </Dialog>
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
  loadAllCategory: '/category/loadAllCategory4Blog',
  saveBlog: '/blog/saveBlog',
  getUserInfo: '/getUserInfo',
  getBlogById: '/blog/getBlogById',
  autoSaveBlog: '/blog/autoSaveBlog',
}
const { proxy } = getCurrentInstance()
const windowConfig = reactive({
  show: false,
  buttons: [
    {
      type: 'danger',
      text: '确定',
      click: () => {
        showSettings()
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
    blogFormData.value = { tagList: [] }
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
    (blogFormData.value.title == '' && blogFormData.value.content == '') ||
    timer.value == null ||
    dialogConfig.show
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
// 弹框中的form表单
const settingFormDataRef = ref()

// 新增 修改
const dialogConfig = reactive({
  show: false,
  title: '博客设置',
  buttons: [
    {
      type: 'danger',
      text: '确定',
      click: () => {
        submitBlogForm()
      },
    },
  ],
})
// 博客分类
const categoryList = ref([])
const loadCategoryList = async () => {
  const res = await proxy.Request({
    url: api.loadAllCategory,
  })
  if (!res) {
    return
  }
  categoryList.value = res.data
  // console.log(res, '获取博客分类')
}
onMounted(() => {
  loadCategoryList()
})
onUnmounted(() => {
  clearTimer()
})

// 打开dialogConfig弹框 需要校验
// 第一步提交
const showSettings = () => {
  blogFormDataRef.value.validate((valid) => {
    console.log(12, valid)
    if (!valid) {
      return
    }
    dialogConfig.show = true
  })
}
// 标签输入-tag
const closeTag = (index) => {
  blogFormData.value.tagList = blogFormData.value.tagList.filter(
    (item, i) => i !== index
  )
}
const showTagInput = ref(false)
// 点击加号 展示input框 加号隐藏
const addTag = () => {
  showTagInput.value = true
}
const tagInputValue = ref('')
// input框输入完成，input框隐藏 加号显示 数据追加到tags里面
const tagInputResult = () => {
  showTagInput.value = false
  if (!tagInputValue.value.trim().length) return
  if (blogFormData.value.tagList.indexOf(tagInputValue.value) === -1) {
    blogFormData.value.tagList.push(tagInputValue.value)
  }

  tagInputValue.value = undefined
}
// 提交表单
const submitBlogForm = () => {
  settingFormDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    // 提交数据
    const params = {
      // editorType: 1, //编辑器类型 0:富文本 1:markdown编辑器
      markdownContent: blogFormData.markdownContent, //markdownContent
    }
    Object.assign(params, blogFormData.value)
    // console.log(params, 'params')
    // Object.assign(params, settingFormData)
    params.tag = params.tagList.join('|')
    let result = await proxy.Request({
      url: api.saveBlog,
      params,
    })
    if (!result) {
      return
    }
    proxy.Message.success('保存成功')
    dialogConfig.show = false
    closeWindow()
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

.tag-input-panel {
  display: flex;
  align-items: center;
  .tag-list {
    display: flex;
    .tag-item {
      margin-right: 10px;
    }
  }
  .info {
    font-size: 12px;
    color: rgb(175, 175, 175);
    margin-right: 10px;
  }
  .icon-tianjia {
    color: red;
  }
  .el-input {
    margin-left: 10px;
    width: 150px;
  }
}
</style>
