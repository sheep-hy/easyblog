<template>
  <div class="cover">
    <img v-if="cover" :src="proxy.globalInfo.imgUrl + cover" />
    <img v-else :src="img" />
  </div>
</template>

<script setup>
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'
import img from '../assets/yjx.jpg'
const props = defineProps({
  cover: {
    type: String,
  },
})
const { proxy } = getCurrentInstance()
</script>

<style lang="scss" scoped>
.cover {
  background: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  overflow: hidden;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
