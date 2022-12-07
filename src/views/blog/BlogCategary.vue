<template>
  <div class="blog-categary">
    <el-button type="danger">新增分类</el-button>
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
      <template #action="{ index, row }">
        <div class="op"></div>
        <a href="" class="a-lick">修改</a>
        <el-divider direction="vertical" />
        <a href="" class="a-lick">删除</a>
        <el-divider direction="vertical" />
        <a href="" class="a-lick">上移</a>
        <el-divider direction="vertical" />
        <a href="" class="a-lick">下移</a>
      </template>
    </Table>
    <Dialog title="弹框"></Dialog>
  </div>
</template>

<script setup>
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'
const { proxy } = getCurrentInstance()
const api = {
  loadAllCategory: '/category/loadAllCategory4Blog',
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
  console.log(result.data, '博客-分类管理数据')
  tableData.list = result.data || []
}
</script>

<style lang="scss" scoped></style>
