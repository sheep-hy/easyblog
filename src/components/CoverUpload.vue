<template>
  <!-- // show-file-list是否显示已上传文件列表  -->
  <el-upload
    name="file"
    :show-file-list="false"
    class="upload-demo"
    :multiple="false"
    :http-request="uploadImg"
    accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.BMP,.bmp"
  >
    <div class="cover-upload-btn">
      <!-- // 修改场景 需要反显突变 -->
      <template v-if="modelValue">
        <img :src="proxy.globalInfo.imgUrl + modelValue" />
      </template>
      <span v-else class="iconfont icon-tianjia"></span>
    </div>
  </el-upload>
</template>

<script setup>
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'
const { proxy } = getCurrentInstance()
const api = {
  uploadUrl: 'file/uploadImage', // 公用图片上传
}
const emit = defineEmits()
const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  // 子组件通过默认属性名modelvalue 可拿到父组件传过来的值
})
const uploadImg = async (file) => {
  console.log(file, 'file')
  const res = await proxy.Request({
    url: api.uploadUrl,
    dataType: 'file',
    params: {
      file: file.file,
      type: 0,
    },
  })
  if (!res) {
    return
  }
  console.log(res.data.fileName)

  emit('update:modelValue', res.data.fileName)
}
</script>

<style lang="scss" scoped>
.cover-upload-btn {
  width: 100px;
  height: 100px;
  background: rgb(247, 247, 247);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #ddd;
  span {
    font-size: 30px;
    color: #ddd;
  }
  img{
    width:100%;
    // height: 100%;
  }
}
</style>
