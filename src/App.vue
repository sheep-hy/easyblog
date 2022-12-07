<template>
  <div>
    <el-config-provider :locale="locale"  :message="config">
      <router-view></router-view>
    </el-config-provider>
  </div>
</template>
<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
// import HelloWorld from './components/HelloWorld.vue'
import { computed, ref, reactive } from 'vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import en from 'element-plus/dist/locale/en.mjs'

const language = ref('zh-cn')
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en))
const config = reactive({
  max: 1,
})
</script>

<style scoped></style>
