<template>
  <div>
    <div class="top-panel">
      <el-form
        ref="fromDataRef"
        :model="searchFormData"
        label-position="right"
        label-width="50px"
      >
        <el-row>
          <el-col :span="4">
            <el-form-item label="标题">
              <el-input
                placeholder="请输入标题"
                v-model="searchFormData.titleFuzzy"
                :style="{ width: '100%' }"
                @keyup.enter.native="loadDataList"
                clearable
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态" prop="status">
              <el-select
                placeholder="请选择状态"
                clearable
                v-model="searchFormData.status"
                :style="{ width: '100%' }"
              >
                <el-option :value="0" label="草稿"></el-option>
                <el-option :value="1" label="已发布"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="分类" prop="categoryId">
              <el-select
                placeholder="请选择分类"
                v-model="searchFormData.categoryId"
                :style="{ width: '100%' }"
              >
                <el-option
                  v-for="item in categoryList"
                  :value="item.categoryId"
                  :label="item.categoryName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item>
              <el-button type="danger" @click="loadDataList">搜索</el-button>
              <el-button type="danger" @click="showEdit('add')"
                >新增分类
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
      <template #cover="{ index, row }">
        <Cover :cover="row.cover"></Cover>
      </template>
      <!-- 文章信息 -->
      <template #blogInfo="{ index, row }">
        <div>标题：{{ row.title }}</div>
        <div>分类：{{ row.categoryName }}</div>
        <div>作者：{{ row.nickName }}</div>
      </template>
      <!-- 类型 -->
      <template #typeName="{ index, row }">
        <div>
          <!-- 类型：{{ row.type == 1 ? '原创' : '转载' }} -->
          类型：
          <span v-if="row.type == 0">原创</span
          ><span v-if="row.type == 1">转载</span>
        </div>
        <div v-if="row.type == 1">转载地址：{{ row.reprinUrl }}</div>
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
        <div class="op"></div>
        <a
          href="javascript:void(0)"
          class="a-lick"
          @click="showEdit('update', row)"
          v-if="(userInfo.userId==row.userId)"
          >修改</a
        >
        <span v-else>--</span>
        <!-- @click="showEdit('update', row)" -->
        <el-divider direction="vertical" />
        <a href="javascript:void(0)" class="a-lick" @click="del(row.blogId)"
        v-if="(userInfo.userId==row.userId)"
          >删除</a
        >
        <span v-else>--</span>
        <el-divider direction="vertical" />
        <a
          href="javascript:void(0)"
          class="a-lick"
          @click="showDetail(row.blogId)"
          >预览</a
        >
      </template>
    </Table>
    <BlogEdit ref="blogEditRef" @callback="loadDataList"></BlogEdit>
    <BlogDetail ref="blogDetailRef"></BlogDetail>
  </div>
</template>

<script setup>
import { defineComponent, getCurrentInstance, reactive, ref } from 'vue'
import BlogEdit from './components/BlogEdit.vue'
import BlogDetail from './components/BlogDetail.vue'

const { proxy } = getCurrentInstance()
const userInfo = ref(proxy.VueCookies.get('userInfo') || {})
// 表单相关
const fromDataRef = ref()
const searchFormData = reactive({})
const api = {
  loadAllCategory: '/category/loadAllCategory4Blog',
  loadBlog: '/blog/loadBlog',
  delBlog: '/blog/recoveryBlog',
}
//获取博客分类
const categoryList = ref([])
const loadCategoryList = async () => {
  const res = await proxy.Request({
    url: api.loadAllCategory,
  })
  if (!res) {
    return
  }
  categoryList.value = res.data
  // console.log(res, '获取博客分类')
}
loadCategoryList()
// 封面需要定义插槽
const columns = [
  { label: '封面', prop: 'cover', width: 80, scopedSlots: 'cover' },
  { label: '文章信息', prop: 'blogInfo', width: 150, scopedSlots: 'blogInfo' },
  { label: '编辑器', prop: 'editorTypeName', width: 100 },
  { label: '类型', prop: 'typeName', width: 150, scopedSlots: 'typeName' },
  { label: '评论', prop: 'allowCommentTypeName', width: 100 },
  { label: '状态', prop: 'statusName', width: 80, scopedSlots: 'statusName' },
  { label: '时间', prop: 'time', width: 200, scopedSlots: 'time' },
  { label: '操作', prop: 'action', width: 200, scopedSlots: 'action' },
]
const tableData = ref({})
// const tableData = reactive({})
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
    url: api.loadBlog,
    params,
  })
  if (!result) {
    return
  }
  // Object.assign(tableData,result.data);
  tableData.value = result.data || []
}
const blogEditRef = ref(null)
const showEdit = (type, data) => {
  blogEditRef.value.init(type, data)
}
//删除
const del = async (id) => {
  proxy.Confirm('你确定要删除？', async () => {
    const result = await proxy.Request({
      url: api.delBlog,
      params: {
        blogId: id,
      },
    })
    if (!result) {
      return
    }
    loadDataList()
  })
}
// 详情
const blogDetailRef = ref(null)
const showDetail = (id) => {
  blogDetailRef.value.showDetail(id)
}
</script>

<style lang="scss" scoped></style>
