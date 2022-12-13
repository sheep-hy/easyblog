<template>
  <div>
    <Window
      :show="windowConfig.show"
      :buttons="windowConfig.buttons"
      :showCancel="false"
      @close="closeWindow"
    >
      <div class="my-title">{{ blog.title }}</div>
      <div v-html="blog.content" class="blog-detail"></div>
    </Window>
  </div>
</template>

<script setup>
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css' //样式
const api = {
  getBlogById: '/blog/getBlogById',
}
const { proxy } = getCurrentInstance()
const windowConfig = reactive({
  show: false,
  buttons: [],
})
const closeWindow = () => {
  windowConfig.show = false
}
const blog = ref({})
const showDetail = async (blogId) => {
  windowConfig.show = true
  const result = await proxy.Request({
    url: api.getBlogById,
    params: {
      blogId,
    },
  })
  if (!result) {
    return
  }
  blog.value = result.data
  nextTick(() => {
    //高亮显示
    let blocks = document.querySelectorAll("pre code");
    blocks.forEach((block) => {
      hljs.highlightBlock(block);
    });
  });
}
defineExpose({ showDetail })
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
