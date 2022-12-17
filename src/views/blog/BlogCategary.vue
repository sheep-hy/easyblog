<template>
  <div class="blog-categary">
    <el-button
      type="danger"
      size="small"
      @click="showEdit('add')"
      v-if="userInfo.roleType == 1"
      >新增分类</el-button
    >
    <Table
      :columns="columns"
      :showPagination="false"
      :dataSource="tableData"
      :fetch="loadFetchList"
      :options="tableOptions"
    >
      <template #cover="{ index, row }">
        <!-- {{ row.cover }} -->
        <!-- <img :src="proxy.globalInfo.imgUrl + row.cover" /> -->
        <Cover :cover="row.cover"></Cover>
      </template>
      <template #action="{ index, row }"  v-if="userInfo.roleType == 1">
        <a
          href="javascript:void(0)"
          class="a-lick"
          @click="showEdit('update', row)"
          >修改</a
        >
        <el-divider direction="vertical" />
        <a href="javascript:void(0)" @click="del(row)" class="a-lick">删除</a>
        <el-divider direction="vertical" />
        <a
          href="javascript:void(0)"
          @click="sort(index, 'up')"
          :class="[index == 0 ? 'not-allow' : 'a-lick']"
          >上移</a
        >
        <el-divider direction="vertical" />
        <a
          href="javascript:void(0)"
          @click="sort(index, 'down')"
          :class="[index == tableData.list.length - 1 ? 'not-allow' : 'a-lick']"
          >下移</a
        >
      </template>
    </Table>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      @close="dialogConfig.show = false"
      width="31.25rem"
    >
      <el-form
        ref="fromDataRef"
        :model="formData"
        label-position="right"
        :rules="rules"
        label-width="5rem"
      >
        <!-- label-width="6.25rem" styrulesle="max-width: 28.75rem"-->
        <el-form-item label="名称" prop="categoryName">
          <el-input
            placeholder="请输入名称"
            v-model="formData.categoryName"
            size="large"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="简介" prop="categoryDesc">
          <el-input
            type="textarea"
            v-model="formData.categoryDesc"
            :autoSize="{ minRows: 4, maxRow: 4 }"
          >
          </el-input>
        </el-form-item> </el-form
    ></Dialog>
  </div>
</template>

<script setup>
import {
  defineComponent,
  getCurrentInstance,
  nextTick,
  reactive,
  ref,
} from 'vue'
const { proxy } = getCurrentInstance()
const userInfo = ref(proxy.VueCookies.get('userInfo') || {})
const api = {
  loadAllCategory: '/category/loadAllCategory4Blog',
  saveCategory: '/category/saveCategory4Blog',
  delCategory: '/category/delCategory4Blog',
  changeCategorySort: '/category/changeCategorySort4Blog',
}
// 封面需要定义插槽
const columns = [
  { label: '封面', prop: 'cover', width: 100, scopedSlots: 'cover' },
  { label: '名称', prop: 'categoryName', width: 150 },
  { label: '简介', prop: 'categoryDesc' },
  { label: '博客数', prop: 'blogCount', width: 100 },
  { label: '操作', prop: 'action', width: 200, scopedSlots: 'action' },
]
const tableData = reactive({ list: [] })
const tableOptions = reactive({
  extHeight: 10,
})
const loadFetchList = async () => {
  let result = await proxy.Request({
    url: api.loadAllCategory,
  })
  if (!result) {
    return
  }
  // console.log(result.data, '博客-分类管理数据')
  tableData.list = result.data || []
}
// 新增 修改
const dialogConfig = reactive({
  show: false,
  title: '标题',
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
// 表单相关
const fromDataRef = ref()
const formData = reactive({})
const rules = {
  categoryName: [
    {
      required: true,
      message: '请输入名称',
    },
  ],
}
const showEdit = (type, data) => {
  dialogConfig.show = true
  nextTick(() => {
    // 等页面更新完了在重置掉
    fromDataRef.value.resetFields()
    if (type === 'add') {
      dialogConfig.title = '新增分类'
    } else if (type === 'update') {
      dialogConfig.title = '修改分类'
      Object.assign(formData, data)
    }
  })
}
//提交
const submitForm = () => {
  fromDataRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    let params = {}
    Object.assign(params, formData)
    const res = await proxy.Request({
      url: api.saveCategory,
      params: params,
    })
    if (!res) {
      return
    }
    dialogConfig.show = false
    proxy.Message.success('保存成功')
    loadFetchList()
  })
}
// 删除
const del = (row) => {
  proxy.Confirm('你确定要删除？', async () => {
    const res = await proxy.Request({
      url: api.delCategory,
      params: {
        categoryId: row.categoryId,
      },
    })
    if (!res) {
      return
    }
    proxy.Message.success('删除成功')
    loadFetchList()
  })
}
// 排序
const sort = async (index, type) => {
  let categoryList = tableData.list
  if (
    (index === 0 && type === 'up') ||
    (index === tableData.list.length - 1 && type === 'down')
  ) {
    return
  }
  const number = type === 'down' ? 1 : -1
  let temp = categoryList[index]
  categoryList.splice(index, 1)
  // 再把值塞进去
  categoryList.splice(index + number, 0, temp)
  const res = await proxy.Request({
    url: api.changeCategorySort,
    dataType: 'json',
    params: categoryList,
  })
  if (!res) {
    return
  }
  proxy.Message.success('重新排序成功')
  loadFetchList()
}
</script>

<style lang="scss" scoped></style>
