<template>
  <div class="">
    <el-form
      ref="fromDataRef"
      :model="formData"
      label-position="right"
      :rules="rules"
      label-width="200px"
      style="width: 50%"
    >
      <el-form-item label="是否开启评论/留言板" prop="openCommentType">
        <el-radio-group v-model="formData.openCommentType">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="formData.openCommentType == 1"
        label="畅言appid"
        prop="changyanAppId"
      >
        <el-input v-model="formData.changyanAppId" />
      </el-form-item>

      <el-form-item
        v-if="formData.openCommentType == 1"
        label="畅言appkey"
        prop="changyanAppKey"
      >
        <el-input v-model="formData.changyanAppKey" />
      </el-form-item>

      <el-form-item label="是否开启Git Pages" prop="gitPagesType">
        <el-radio-group v-model="formData.gitPagesType">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否公安备案和ICP备案信息" prop="showIcp">
        <el-radio-group v-model="formData.showIcp">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="formData.showIcp == 1">
        <el-form-item label="ICP备案域名" prop="icpDomain">
          <el-input v-model="formData.icpDomain" />
        </el-form-item>
        <el-form-item label="ICP备案号" prop="icpNo">
          <el-input v-model="formData.icpNo" />
        </el-form-item>
        <el-form-item label="公安备案省份" prop="policeProvince">
          <el-select
            placeholder="请选择分类"
            v-model="formData.policeProvince"
            showSearch
            clearable
            :style="{ width: '100%' }"
          >
            <el-option
              v-for="item in provinceList"
              :value="item"
              :label="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公安备案号" prop="policeNo">
          <el-input v-model="formData.policeNo" />
        </el-form-item>
      </template>
      <el-form-item label="下载静态页面" prop="">
        <a href="javascript:void(0)" class="a-link" @click="createZip()"
          >点击下载</a
        >
      </el-form-item>
      <el-form-item label="" prop="">
        <el-button type="danger" @click="submitForm">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'
const {proxy}=getCurrentInstance()
const formData = reactive({})
const fromDataRef = ref(null)
const api = {
  getSysSetting: 'sysSetting/getSysSetting',
  saveSysSetting: 'sysSetting/saveSysSetting',
  createZip: 'sysSetting/createZip',
}

const provinceList = [
  '京',
  '津',
  '冀',
  '晋',
  '蒙',
  '辽',
  '吉',
  '黑',
  '沪',
  '苏',
  '浙',
  '皖',
  '闽',
  '赣',
  '鲁',
  '豫',
  '鄂',
  '湘',
  '粤',
  '桂',
  '琼',
  '渝',
  '川',
  '黔',
  '滇',
  '藏',
  '陕',
  '甘',
  '青',
  '宁',
  '新',
  '台',
  '港',
  '澳',
]

const rules = {
  openCommentType: [{ required: true, message: '是否开启评论不能为空' }],
  changyanAppId: [{ required: true, message: '畅言appId不能为空' }],
  changyanAppKey: [{ required: true, message: '畅言appKey不能为空' }],
  gitPagesType: [{ required: true, message: '是否开启Git Pages不能为空' }],
  showIcp: [
    { required: true, message: '是否开启公安备案和ICP备案信息不能为空' },
  ],
  icpDomain: [{ required: true, message: 'ICP备案域名不能为空' }],
  icpNo: [{ required: true, message: 'ICP备案号不能为空' }],
  policeProvince: [{ required: true, message: '公安备案省份不能为空' }],
  policeNo: [{ required: true, message: '公安备案号不能为空' }],
}

const getSysSetting = async () => {
  let result = await proxy.Request({
    url: api.getSysSetting,
  })
  if (result != null) {
    Object.assign(formData, result.data)
  }
}
getSysSetting()

const submitForm = () => {
  fromDataRef.value.validate(async (valid) => {
    if (!valid) {
      return false
    }
    let params = {}
    Object.assign(params, formData)
    let result = await proxy.Request({
      url: api.saveSysSetting,
      params: params,
    })
    if (!result) {
      return
    }
    proxy.Message.success('保存成功')
  })
}
const createZip = async () => {
  let result = await proxy.Request({
    url: api.createZip,
  })
  if (!result) {
    return
  }
  document.location.href =
    '/api/file/download/' + result.data + '/' + encodeURI('静态页面.zip')
}
</script>

<style lang="sass" scoped></style>
