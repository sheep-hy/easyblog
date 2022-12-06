<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">用户登录</div>
      <el-form
        ref="fromDataRef"
        :model="formData"
        label-position="right"
        :rules="rules"
      >
        <!-- label-width="100px" styrulesle="max-width: 460px"-->
        <el-form-item prop="account">
          <el-input
            placeholder="请输入账号"
            v-model="formData.account"
            size="large"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <!--  type="password" -->
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="formData.password"
            size="large"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              placeholder="请输入验证码"
              v-model="formData.checkCode"
              size="large"
              @keyup.enter.native="login"
              class="input-panel"
            />
            <img :src="checkCodeUrl" class="check-code" @click="changeCode" />
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="formData.remenberMe" :label="true">
            记住我
          </el-checkbox>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" style="width: 100%" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import md5 from 'js-md5'
import VueCookies from 'vue-cookies'
import {useRouter} from 'vue-router'
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'

const { proxy } = getCurrentInstance()
const router=useRouter()
const api = {
  checkCode: 'api/checkCode',
  login: '/login',
}
const checkCodeUrl = ref(api.checkCode)
const changeCode = () => {
  checkCodeUrl.value = api.checkCode + '?' + new Date().getTime()
}
// 表单相关
const fromDataRef = ref()
const formData = reactive({})
const rules = {
  account: [
    {
      required: true,
      message: '请输入用户名',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
    },
  ],
  checkCode: [
    {
      required: true,
      message: '请输入验证码',
    },
  ],
}
const init = () => {
  const loginInfo = VueCookies.get('loginInfo')
  if (!loginInfo) {
    return
  }
  // 存在cookies信息 则反显页面
  Object.assign(formData, loginInfo)
  // document.onkeyup=(e)=>{
  //   console.log(e,'11')
  //   if(e.keyCode !== 13){
  //     return 
  //   }
  //   login()
  // }
}
init()
const login = () => {
  fromDataRef.value.validate(async (valid) => {
    console.log(valid, 'valid')
    if (!valid) return
    const cookiesInfo=VueCookies.get('loginInfo')
    let cookiesPassword=cookiesInfo==null?null:cookiesInfo.password
    // 不存在 需要MD5 
    if(cookiesPassword!==formData.password){
      formData.password=md5(formData.password)
    }
    let params = {
      account: formData.account,
      password: formData.password,
      checkCode: formData.checkCode,
    }
    // 18666666666 admin123
    // 密码需要进行MD5
    const res = await proxy.Request({
      url: api.login,
      params: params,
      errorCallback: () => {
        changeCode()
      },
    })
    if (!res) return
    proxy.message.success('登录成功')
    setTimeout(()=>{
      router.push('/home')
    },1000)
    //记住密码 登录成功
    const loginInfo = {
      account: params.account,
      password: params.password,
      remenberMe: formData.remenberMe,
    }
    console.log(loginInfo, 'loginInfo1')
    // 保存用户登录信息 不过期
    VueCookies.set('userInfo', res.data, 0)
    if (formData.remenberMe) {
      // cookies 保存用户信息 设置7天
      VueCookies.set('loginInfo', loginInfo, '7d')
    }
  })
}
</script>

<style lang="scss" scoped>
.login-body {
  height: calc(100vh);
  width: calc(100vw);
  background-position: center;
  background-size: cover;
  background-image: url('../assets/login-bg.jpg');
  object-fit: cover;
  .login-panel {
    width: 300px;
    float: right;
    margin: 50px 50px 0 0;
    background-color: aliceblue;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 2px 2px 10px #ddd;
  }
  .login-title {
    font-size: 18px;
    text-align: center;
    margin-bottom: 10px;
  }
  .check-code-panel {
    width: 100%;
    display: flex;
    align-items: center;
    .input-panel {
      flex: 1;
      margin-right: 5px;
    }
    .check-code {
      // height: 30px;
      // width: 50px;
      cursor: pointer;
    }
  }
}
</style>
