<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      style="height: 300px; overflow-y: hidden"
      v-model="(modelValue)"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup>
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
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
// 内容 HTML
// const valueHtml = ref('<p>hello</p>')
const mode = ref('<p>mode</p>')

// 模拟 ajax 异步获取内容
// onMounted(() => {
  // setTimeout(() => {
  //   valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
  // }, 1500)
// })

const toolbarConfig = {}
const editorConfig = reactive({
  placeholder: '请输入内容...',
  MENU_CONF: { uploadImage: {} },
})
editorConfig.MENU_CONF.uploadImage = {
  // form-data fieldName ，默认值 'wangeditor-uploaded-image'
  fieldName: 'your-custom-name',

  // 单个文件的最大体积限制，默认为 3M
  maxFileSize: 3 * 1024 * 1024, // 1M

  // 最多可上传几个文件，默认为 100
  maxNumberOfFiles: 10,

  // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
  // allowedFileTypes: ['image/*'],

  server: '/api/file/uploadImage4WangEditor',
  // 自定义插入图片
  customInsert(res, insertFn) {
    // res 即服务端的返回结果

    // 从 res 中找到 url alt href ，然后插入图片
    // insertFn(url, alt, href)
    console.log(res, '富文本上传图片')
    insertFn(res.data.url, '', '')
  },
}
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}
const emit = defineEmits()
const handleChange = (editor) => {
  // console.log(editor,11)
  emit('update:modelValue', editor.getHtml())
}
</script>

<style lang="sass" scoped></style>
