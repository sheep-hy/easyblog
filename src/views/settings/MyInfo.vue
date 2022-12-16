<template>
  <div class="myinfo">
    <el-form
      ref="formDataRef"
      :model="formData"
      label-position="right"
      :rules="rules"
      label-width="100px"
    >
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="头像" prop="avatar">
            <!-- <Cover v-model="formData.cover"></Cover> -->
            <CoverUpload
              v-model="formData.avatar"
              @callback="saveAvatar"
            ></CoverUpload>
          </el-form-item>
          <el-form-item label="昵称" prop="nickName">
            <el-input placeholder="请输入昵称" v-model="formData.nickName">
            </el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input placeholder="请输入手机号" v-model="formData.phone">
            </el-input>
          </el-form-item>
          <el-form-item label="密码" prop="phone">
            <a
              href="javascript:void(0)"
              @click="showUpdatePassword"
              class="a-lick"
              >修改密码</a
            >
          </el-form-item>
          <!-- <el-form-item label="密码" prop="phone">
            <a href="javascript:void(0)" @click="del(row)" class="a-lick"
              >修改密码</a
            >
          </el-form-item> -->
          <el-form-item label="默认编辑器" prop="editorType">
            <el-radio-group v-model="formData.editorType">
              <el-radio :label="0">富文本编辑器</el-radio>
              <el-radio :label="1">MarkDown编辑器</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="职业" prop="profession">
            <el-input placeholder="请输入职业" v-model="formData.profession">
            </el-input>
          </el-form-item>
          <el-form-item label="" prop="editorType">
            <el-button type="danger" @click="saveMy">保存</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="简介" prop="introduction">
            <EditorHtml
              v-model="formData.introduction"
              :height="editorHtmlHeight"
            ></EditorHtml>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      @close="dialogConfig.show = false"
      width="400"
    >
      <el-form
        ref="fromPasswordRef"
        :model="formPassword"
        label-position="right"
        :rules="rules"
        label-width="5rem"
      >
        <!-- label-width="6.25rem" styrulesle="max-width: 28.75rem"-->
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="formPassword.password">
          </el-input>
        </el-form-item>
        <el-form-item label="重置密码" prop="rePassword">
          <el-input placeholder="请输入密码" v-model="formPassword.rePassword">
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import {
  defineComponent,
  getCurrentInstance,
  reactive,
  ref,
  nextTick,
} from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const { proxy } = getCurrentInstance()
const api = {
  getUserInfo: '/getUserInfo',
  saveMyInfo: 'saveMyInfo',
  updateMyPassword: '/updateMyPassword',
  saveAvatar: '/saveAvatar',
}
const formDataRef = ref(null)
const formData = ref({})
const validateRePass = (rule, value, callback) => {
  if (value !== formPassword.value.password) {
    callback(new Error(rule.message))
  } else {
    callback()
  }
}
const rules = {
  nickName: [{ required: true, message: '昵称不能为空' }],
  editorType: [{ required: true, message: '请选择默认编辑器' }],
  password: [
    { required: true, message: '请输入密码' },
    {
      validator: proxy.Verify.password,
      message: '密码最少8位，只能数字字母和特殊字符',
    },
  ],
  rePassword: [
    { required: true, message: '请再次输入密码' },
    {
      validator: validateRePass,
      message: '两次输入的密码不一致',
    },
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    {
      validator: proxy.Verify.phone,
      trigger: 'blur',
      message: '请输入正确的手机号',
    },
  ],
}
const getUserInfo = async () => {
  let res = await proxy.Request({
    url: api.getUserInfo,
  })
  if (!res) {
    return
  }
  formData.value = res.data
}
getUserInfo()
// 保存个人信息
const saveMy = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let result = await proxy.Request({
      url: api.saveMyInfo,
      params: {
        avatar: formData.value.avatar,
        nickName: formData.value.nickName,
        phone: formData.value.phone,
        editoType: formData.value.editoType,
        profession: formData.value.profession,
        introduction: formData.value.introduction,
      },
    })
    if (!result) {
      return
    }
    proxy.Message.success('保存成功')

    store.commit('user/updateUserInfo', {
      nickName: formData.value.nickName,
      avatar: formData.value.avatar,
    })
  })
}
// 修改头像
const saveAvatar = async (avatar) => {
  const res = await proxy.Request({
    url: api.saveAvatar,
    params: {
      avatar: avatar,
    },
  })
  if (!res) {
    return
  }
  proxy.Message.success('修改头像成功')
  store.commit('user/updateUserInfo', {
    nickName: formData.value.nickName,
    avatar: avatar,
  })
}
const formPassword = ref({})
const fromPasswordRef = ref(null)
// 新增 修改
const dialogConfig = reactive({
  show: false,
  title: '修改密码',
  buttons: [
    {
      type: 'danger',
      text: '确定',
      click: () => {
        submitPassword()
      },
    },
  ],
})
// 确定修改密码
const submitPassword = () => {
  fromPasswordRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    const res = await proxy.Request({
      url: api.updateMyPassword,
      params: {
        password: formPassword.value.password,
      },
    })
    if (!res) {
      return
    }
    proxy.Message.success('修改密码成功')
    dialogConfig.show = false
  })
}
// 打开修改密码弹框
const showUpdatePassword = () => {
  dialogConfig.show = true
  nextTick(() => {
    fromPasswordRef.value.resetFields()
    formPassword.value = {}
  })
}
</script>

<style lang="sass" scoped></style>
