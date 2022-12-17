<template>
  <div>
    <div class="top-panel">
      <el-form ref="fromDataRef" :model="searchFormData" label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item label="昵称" label-width="50px">
              <el-input
                placeholder="请输入昵称"
                v-model="searchFormData.nickNameFuzzy"
                :style="{ width: '100%' }"
                @keyup.enter.native="loadDataList"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号" label-width="80px">
              <el-input
                placeholder="请输入手机号"
                v-model="searchFormData.phoneFuzzy"
                :style="{ width: '100%' }"
                @keyup.enter.native="loadDataList"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label-width="10px">
              <el-button type="danger" @click="loadDataList">搜索</el-button>
              <el-button type="danger" @click="showEdit('add')"
              v-if="userInfo.roleType==1"
                >新增成员
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <Table
      :columns="columns"
      :showPagination="true"
      :dataSource="tableData"
      :fetch="loadDataList"
      :options="tableOptions"
    >
      <!-- 封面 -->
      <template #avatar="{ index, row }">
        <Cover :cover="row.avatar"></Cover>
      </template>
      <template #userInfo="{ index, row }">
        <div>昵&nbsp;&nbsp;&nbsp;&nbsp;称：{{ row.nickName }}</div>
        <div>手机号：{{ row.phone }}</div>
        <div>职&nbsp;&nbsp;&nbsp;&nbsp;业：{{ row.profession }}</div>
      </template>
      <!-- 角色 -->
      <template #roleInfo="{ index, row }">
        <div>{{ row.roleTypeName }}</div>
      </template>
      <!-- 状态 -->
      <template #statusInfo="{ index, row }">
        <div>
          <span :style="{ color: row.status == 1 ? 'green' : 'red' }">{{
            row.statusName
          }}</span>
        </div>
      </template>
      <!-- 时间 -->
      <template #timeInfo="{ index, row }">
        <div>创建时间：{{ row.createTime }}</div>
        <div>最后登录时间：{{ row.lastLoginTime }}</div>
      </template>
      <!-- 时间 -->
      <template #operation="{ index, row }">
        <span v-if="userInfo.roleType == 1">
          <a
            href="javascript:void(0)"
            @click="showEdit('edit', row)"
            class="a-link"
            >修改</a
          >
          <el-divider direction="vertical" />
          <a
            href="javascript:void(0)"
            class="a-link"
            @click="changeAccountStatus(row)"
          >
            {{ row.status }} {{ row.status == 0 ? '启用' : '禁用' }}
          </a>
          <el-divider direction="vertical" />
          <a
            href="javascript:void(0)"
            class="a-link"
            @click="showUpdatePassword(row.userId)"
            >修改密码</a
          >
          <el-divider direction="vertical" />
          <a href="javascript:void(0)" class="a-link" @click="delUser(row)"
            >删除</a
          >
        </span>
        <span v-else>--</span>
      </template>
    </Table>
    <!-- // 新增成员 -->
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      @close="dialogConfig.show = false"
      width="900px"
    >
      <el-form
        ref="userFromDataRef"
        :model="userFormData"
        label-position="right"
        :rules="rules"
        label-width="120px"
      >
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="昵称" prop="nickName">
              <el-input :maxLength="30" v-model="userFormData.nickName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input :maxLength="11" v-model="userFormData.phone" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10" v-if="userFormData.userId == null">
          <el-col :span="12">
            <el-form-item label="密码" prop="password">
              <el-input
                v-model="userFormData.password"
                :maxLength="20"
                type="password"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="再次输入密码" prop="rePassword">
              <el-input
                v-model="userFormData.rePassword"
                :maxLength="20"
                type="password"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="默认编辑器" prop="editorType">
              <el-radio-group v-model="userFormData.editorType">
                <el-radio :label="0">富文本编辑器</el-radio>
                <el-radio :label="1">MarkDown编辑器</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职业" prop="profession">
              <el-input v-model="userFormData.profession" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="头像" prop="avatar">
              <cover-upload v-model="userFormData.avatar"></cover-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="10">
          <el-col :span="24">
            <el-form-item label="简介" prop="introduction">
              <EditorHtml
                id="introduction"
                ref="introduction"
                :height="300"
                v-model="userFormData.introduction"
              >
              </EditorHtml>
            </el-form-item>
          </el-col>
        </el-row> </el-form
    ></Dialog>
    <!-- 修改密码 -->
    <Dialog
      :show="dialogConfigEdit.show"
      :title="dialogConfigEdit.title"
      :buttons="dialogConfigEdit.buttons"
      @close="dialogConfigEdit.show = false"
      width="400"
    >
      <el-form
        ref="fromPasswordRef"
        :model="userFormData"
        label-position="right"
        :rules="rules"
        label-width="5rem"
      >
        <!-- label-width="6.25rem" styrulesle="max-width: 28.75rem"-->
        <el-form-item label="密码" prop="password">
          <el-input placeholder="请输入密码" v-model="userFormData.password">
          </el-input>
        </el-form-item>
        <el-form-item label="重置密码" prop="rePassword">
          <el-input placeholder="请输入密码" v-model="userFormData.rePassword">
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

const { proxy } = getCurrentInstance()
const userInfo = ref(proxy.VueCookies.get('userInfo') || {})
// 表单相关
const fromDataRef = ref()
const searchFormData = reactive({})
const api = {
  loadDataList: '/setting/loadUser', // 获取表单数据
  saveTeamUser: '/setting/saveTeamUser', // 保存成员
  updateStatus: '/setting/updateStatus',
  delUser: '/setting/delUser',
  updatePassword: '/setting/updatePassword',
}
// 封面需要定义插槽
const columns = [
  { label: '头像', prop: 'avatar', width: 80, scopedSlots: 'avatar' },
  { label: '用户信息', prop: 'nickName', width: 200, scopedSlots: 'userInfo' },
  { label: '默认编辑器', prop: 'editorTypeName', width: 100 },
  { label: '角色', prop: 'roleTypeName', width: 80, scopedSlots: 'roleInfo' },
  { label: '状态', prop: 'statusInfo', scopedSlots: 'statusInfo', width: 80 },
  { label: '时间', prop: 'createTime', scopedSlots: 'timeInfo', width: 300 },
  { label: '操作', prop: 'operation', width: 250, scopedSlots: 'operation' },
]
// 表格数据
const tableData = ref({})
const tableOptions = reactive({
  extHeight: 70,
})
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  }
  Object.assign(params, searchFormData)
  let result = await proxy.Request({
    url: api.loadDataList,
    params,
  })
  if (!result) {
    return
  }
  // Object.assign(tableData,result.data);
  tableData.value = result.data || []
}

// 添加成员
const userFromDataRef = ref(null)
const userFormData = ref({})
const validateRePass = (rule, value, callback) => {
  if (value !== userFormData.value.password) {
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
// 新增 修改
const dialogConfig = reactive({
  show: false,
  title: '新增用户',
  buttons: [
    {
      type: 'danger',
      text: '确定',
      click: () => {
        // console.log(111)
        submitForm()
      },
    },
  ],
})
const showEdit = (type, data) => {
  dialogConfig.show = true
  nextTick(() => {
    // 等页面更新完了在重置掉
    userFromDataRef.value.resetFields()
    userFormData.value = {}
    if (type === 'add') {
      dialogConfig.title = '新增账号'
      userFormData.value = { introdution: '' }
    } else if (type === 'edit') {
      dialogConfig.title = '修改账号'
      // userFormData.value={...userFormData.value,...data}
      Object.assign(userFormData.value, data)
    }
  })
}
//提交
const submitForm = () => {
  userFromDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, userFormData.value)
    delete params.createTime
    delete params.lastLoginTime
    let result = await proxy.Request({
      url: api.saveTeamUser,
      params: params,
    })
    if (!result) {
      return
    }
    dialogConfig.show = false
    proxy.Message.success('保存成功')
    loadDataList()
  })
}
//修改状态 禁用和启用的切换
const changeAccountStatus = (row) => {
  const status = row.status == '0' ? '1' : '0'
  const statusName = row.status == '0' ? '禁用' : '启用'
  proxy.Confirm(
    '你确定要【' + statusName + '】' + row.nickName + '？',
    async () => {
      const res = await proxy.Request({
        url: api.updateStatus,
        params: {
          userId: row.userId,
          status: status,
        },
      })
      if (!res) {
        return
      }
      proxy.Message.success('切换成功')
      loadDataList()
    }
  )
}
// 删除
const delUser = (row) => {
  proxy.Confirm('你确定要删除' + row.nickName + '？', async () => {
    const res = await proxy.Request({
      url: api.delUser,
      params: {
        userId: row.userId,
      },
    })
    if (!res) {
      return
    }
    proxy.Message.success('删除成功')
    loadDataList()
  })
}
// 修改密码 因为新增也有密码校验
// const formPassword = ref({})
const fromPasswordRef = ref(null)
// 新增 修改
const dialogConfigEdit = reactive({
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
      url: api.updatePassword,
      params: {
        userId: userFormData.value.userId,
        password: userFormData.value.password,
      },
    })
    if (!res) {
      return
    }
    proxy.Message.success('修改密码成功')
    dialogConfigEdit.show = false
  })
}
// 打开修改密码弹框
const showUpdatePassword = (userId) => {
  dialogConfigEdit.show = true
  nextTick(() => {
    fromPasswordRef.value.resetFields()
    userFormData.value = { userId: userId }
  })
}
</script>

<style lang="scss" scoped></style>
