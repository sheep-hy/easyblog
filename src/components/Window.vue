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
          <el-button v-if='showCancel' link @click="close" size="small"> 取消 </el-button>
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
  showCancel:{
    type: Boolean,
    default: true,
  }
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
  // overflow: hidden;
  // width: 100%;
  background-color: #fff;
  // background-color: pink;
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
    // 60+10+30+50+20
    height: calc(100vh - 172px);
    padding: 10px;
    overflow: auto;
  }
  .footer {
    height: 50px;
    border-top: 1px solid #ddd;
    // background-color: #fff;
    text-align: center;
    line-height: 50px;
  }
}
</style>
