<template>
  <div class="window" :style="{ width: width + 'px' }" v-show="show">
    <div class="title">
      <span class="iconfont icon-back" @click="close"></span>
    </div>
    <div class="body">
      <slot></slot>
    </div>
    <div class="footer">
      <template v-if="(buttons && buttons.length > 0) || showCancel">
        <div class="dialog-footer">
          <el-button link @click="close" size="small"> 取消 </el-button>
          <el-button
            v-for="btn in buttons"
            :type="btn.type"
            @click="btn.click"
            size="small"
          >
            {{ btn.text }}
          </el-button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'
const width = ref(window.innerWidth - 250)
const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  buttons: {
    type: Array,
  },
})
const emit = defineEmits('close')
const close = () => {
  emit('close')
}
</script>

<style lang="scss" scoped>
.window {
  position: absolute;
  left: 0px;
  top: 0px;

  height: calc(100vh - 80px);
  // width: 100%;
  // border:1px solid red;
  background-color: #fff;
  z-index: 99;
  .title {
    height: 30px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    .iconfont {
      cursor: pointer;
    }
  }
  .body {
    height: calc(100vh - 152px);
    // background-color: pink;
    padding:10px;
  }
  .footer {
    height: 50px;
    border-top: 1px solid #ddd;
    background-color: #fff;
    text-align: center;
    line-height: 45px;
  }
}
</style>
