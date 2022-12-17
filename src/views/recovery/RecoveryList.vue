<template>
  <div>
    <div class="top-panel">
      <el-form
        ref="searchFromDataRef"
        :model="searchFormData"
        label-position="right"
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="标题" label-width="50px">
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
          <el-col :span="5">
            <el-form-item label-width="10px">
              <el-button type="danger" @click="loadDataList">搜索</el-button>
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
      <template #cover="{ index, row }">
        <Cover :cover="row.cover"></Cover>
      </template>
      <!-- 文章信息 -->
      <template #blogInfo="{ index, row }">
        <div>标题：{{ row.title }}</div>
        <div>
          文章类型：{{ row.blogType == 0 ? '博客' : '专题' }}
          <el-divider direction="vertical" />
          <span>{{ row.blogType == 0 ? '分类' : '专题' }}</span
          >,{{ row.categoryName || '--' }}
        </div>
        <div>作者：{{ row.nickName }}</div>
      </template>
      <!-- 状态 -->
      <template #statusName="{ index, row }">
        <span v-if="row.status == 1" :style="{ color: 'green' }">{{
          row.statusName
        }}</span>
        <span v-else :style="{ color: 'red' }">{{ row.statusName }}</span>
      </template>
      <!-- 时间 -->
      <template #time="{ index, row }">
        <div>创建时间：{{ row.createTime }}</div>
        <div>更新时间：{{ row.lastUpdateTime }}</div>
      </template>
      <template #action="{ index, row }">
      <template  v-if="row.userId == userInfo.userId || userInfo.roleType == 1">
        <a href="javascript:void(0)" class="a-lick" @click="reductionBlog(row)"
          >还原</a
        >
        <el-divider direction="vertical" />
        <a href="javascript:void(0)" class="a-lick" @click="del(row.blogId)"
          >删除</a
        >
      </template>
      <span v-else>--</span>
      </template>
    </Table>
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
const searchFromDataRef = ref()
const searchFormData = reactive({})

const api = {
  loadDataList: '/blog/loadRecoveryList',
  delBlog: '/blog/delBlog',
  reductionBlog: '/blog/reductionBlog',
}
// 封面需要定义插槽
const columns = [
  { label: '封面', prop: 'cover', width: 80, scopedSlots: 'cover' },
  { label: '文章信息', prop: 'blogInfo', scopedSlots: 'blogInfo' },
  { label: '编辑器', prop: 'editorTypeName', width: 100 },
  // { label: '评论', prop: 'allowCommentTypeName', width: 100 },
  { label: '状态', prop: 'statusName', width: 80, scopedSlots: 'statusName' },
  { label: '时间', prop: 'time', width: 280, scopedSlots: 'time' },
  { label: '操作', prop: 'action', width: 200, scopedSlots: 'action' },
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

// 还原
const reductionBlog = (data) => {
  proxy.Confirm(
    `确认要恢复【${data.title}】吗？恢复后博客为草稿状态。`,
    async () => {
      let result = await proxy.Request({
        url: api.reductionBlog,
        params: {
          blogId: data.blogId,
        },
      })
      if (!result) {
        return
      }
      proxy.Message.success('恢复成功')
      loadDataList()
    }
  )
}

// 删除
const del = (data) => {
  proxy.Confirm(`确认要删除【${data.title}】吗，删除后无法找回？`, async () => {
    let result = await proxy.Request({
      url: api.delBlog,
      params: {
        blogId: data.blogId,
      },
    })
    if (!result) {
      return
    }
    proxy.Message.success('删除成功')
    loadDataList()
  })
}
</script>

<style lang="scss" scoped></style>
