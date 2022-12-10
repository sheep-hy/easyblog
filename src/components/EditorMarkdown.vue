<template>
  <div class="">
    <v-md-editor
      v-model="(modelValue)"
      :height="height + 'px'"
      :disabled-menus="[]"
      @upload-image="handleUploadImage"
      :include-level="[1, 2, 3, 4, 5, 6]"
      @change="change"
    ></v-md-editor>
    <!-- include-level -导航层级
类型: Array
默认值: [2, 3]
目录导航生成时包含的标题。默认包含 2 级、3 级标题 -->
    <!-- 上传图片菜单默认为禁用状态 设置 disabled-menus 为空数组可以开启。 -->
    <!-- change事件触发双向绑定 -->
  </div>
</template>

<script setup>
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'
import VMdEditor from '@kangc/v-md-editor'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// highlightjs
import hljs from 'highlight.js'

VMdEditor.use(githubTheme, {
  Hljs: hljs,
})
const { proxy } = getCurrentInstance()
// const text = ref('11')
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  height: {
    type: Number,
    default: 300,
  },
})
const handleUploadImage = async (event, insertImage, files) => {
  // 拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
  console.log(files, 'EditorMarkdown')
  const res = await proxy.Request({
    url: 'file/uploadImage',
    dataType: 'file',
    params: {
      type: 1,
      file: files[0],
    },
  })
  if (!res) {
    return
  }
  insertImage({
    url: proxy.globalInfo.imgUrl + res.data.fileName,
    desc: '图片',
  })
  // 此处只做示例
  // insertImage({
  //   url:
  //     'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1269952892,3525182336&fm=26&gp=0.jpg',
  //   desc: '七龙珠',
  //   // width: 'auto',
  //   // height: 'auto',
  // });
}
const emit = defineEmits()
const change = (text, html) => {
  emit('update:modelValue', text)
  emit('htmlContent', html)
}
</script>

<style lang="sass" scoped></style>
