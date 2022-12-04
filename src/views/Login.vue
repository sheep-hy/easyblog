<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">用户登录</div>
      <el-form
        ref="fromDataRef"
        :model="fromData"
        label-position="right"
        :rules="rules"
      >
        <!-- label-width="100px" styrulesle="max-width: 460px"-->
        <el-form-item prop="account">
          <el-input
            placeholder="请输入账号"
            v-model="fromData.account"
            size="large"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            placeholder="请输入密码"
            v-model="fromData.password"
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
              v-model="fromData.checkCode"
              size="large"
              class="input-panel"
            />
            <img :src="checkCodeUrl" class="check-code" @click="changeCode" />
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-checkbox v-model="fromData.remenberMe" :label="true">
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
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'
const { proxy } = getCurrentInstance
const api = {
  checkCode: 'api/checkCode',
  login: '',
}
const checkCodeUrl = ref(api.checkCode)
const changeCode = () => {
  checkCodeUrl.value = api.checkCode + '?' + new Date().getTime()
}
// 表单相关
const fromDataRef = ref()
const fromData = reactive({})
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
const login = () => {
  fromDataRef.value.validate(async (valid) => {
    console.log(valid, 'valid')
    if (!valid) return
    const res =await proxy.Request()
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
