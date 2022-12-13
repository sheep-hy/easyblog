<template>
  <div class="blog-categary">
    <el-button type="danger" size="small" @click="showEdit('add')"
      >新增专题</el-button
    >
    <el-row :gutter="5">
      <el-col :span="14">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>Card name</span>
              <!-- <el-button class="button" text>Operation button</el-button> -->
            </div>
          </template>
          <Table
            :columns="columns"
            :showPagination="false"
            :dataSource="tableData"
            :fetch="loadFetchList"
            :options="tableOptions"
            @rowClick="rowClick"
            ref="dataTableRef"
          >
            <template #cover="{ index, row }">
              <!-- {{ row.cover }} -->
              <!-- <img :src="proxy.globalInfo.imgUrl + row.cover" /> -->
              <Cover :cover="row.cover"></Cover>
            </template>
            <template #action="{ index, row }">
              <div class="op"></div>
              <a
                href="javascript:void(0)"
                class="a-lick"
                @click="showEdit('update', row)"
                >修改</a
              >
              <el-divider direction="vertical" />
              <a href="javascript:void(0)" @click="del(row)" class="a-lick"
                >删除</a
              >
            </template>
          </Table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card class="box-card">
          <template #header>
            <div class="card-header">
              <span>专题文章</span>
              <!-- <el-button class="button" text>Operation button</el-button> -->
            </div>
          </template>
            <el-tree
              class="tree-panel"
              ref="refTree"
              :data="blogList"
              defaultExpandAll
              node-key="blogId"
              :expand-on-click-node="false"
              :props="treeProps"
              :highlight-current="true"
              draggable
              @node-drop="blogDrag"
            >
              <template #default="{ node, data }">
                <span class="custom-node-style">
                  <span class="node-title">
                    <!-- v-if="data.status == 0"
                      :style="{ color: 'red', 'font-size': '13px' }" -->
                    <span>{{ data.title }}</span>
                    <!-- v-else
                      :style="{ color: 'green', 'font-size': '13px' }" -->
                    <!-- <span>{{ data.title }}</span> -->
                  </span>
                  <span class="node-op">
                    <template v-if="data.blogId === '0'">
                      <a class="a-link" href="javascript:void(0)">新增文章</a>
                      <!-- @click="editBlog('add', data)" -->
                    </template>
                    <template v-else>
                      <!-- @click="showDetail(data)" -->
                      <a class="a-link" href="javascript:void(0)">预览</a>
                      <el-divider direction="vertical" />
                      <!-- @click="editBlog('edit', data)"    v-if="userInfo.userId == data.userId" -->
                      <a class="a-link" href="javascript:void(0)">修改</a>
                      <!-- <span v-else>--</span> -->
                      <el-divider direction="vertical" />
                      <!-- @click="delBlog(data)"
                        v-if="userInfo.userId == data.userId" -->
                      <a class="a-link" href="javascript:void(0)">删除</a>
                      <!-- <span v-else>--</span> -->
                      <el-divider direction="vertical" />
                      <!--    @click="editBlog('add', data)" -->
                      <a class="a-link" href="javascript:void(0)"
                        >新增下级文章</a
                      >
                    </template>
                  </span>
                </span>
              </template>
            </el-tree>
        </el-card>
      </el-col>
    </el-row>

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
import VueCookies from 'vue-cookies'
const { proxy } = getCurrentInstance()
const api = {
  saveCategory: '/category/saveCategory4Special',
  delCategory: 'category/delCategory4Special',
  getSpecialInfo: '/blog/getSpecialInfo',
  loadDataList: '/category/loadCategory4Special',
}
// const userInfo = ref(proxy.VueCookies.get("userInfo") || {});
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
  extHeight: 110,
})
// 一进去状态列表 拿到数据后 默认选择一个 展示展示专题树
const currentCategaryId = ref(null)
const dataTableRef = ref(null)
const loadFetchList = async () => {
  let result = await proxy.Request({
    url: api.loadDataList,
  })
  if (!result) {
    return
  }
  Object.assign(tableData, result.data)
  if (
    currentCategaryId.value == null &&
    result.data.list &&
    result.data.list.length > 0
  ) {
    currentCategaryId.value = result.data.list[0].categoryId
    loadBlogList()
  }
  // 表格需要高亮
  nextTick(() => {
    dataTableRef.value.setCurrentRow('categoryId', currentCategaryId.value)
  })
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
      formData = {}
    } else if (type === 'update') {
      dialogConfig.title = '修改分类'
      formData = { ...formData, ...data }
      // Object.assign(formData, data)
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
    currentCategaryId.value = null
  })
}
// 专题树

// 、、点击触发
const rowClick = (row) => {
  currentCategaryId.value = row.categoryId
  loadBlogList()
}
// 获取专题文章
const blogList = ref([])
const loadBlogList = async (categoryId) => {
  const res = await proxy.Request({
    url: api.getSpecialInfo,
    params: {
      categoryId: currentCategaryId.value,
      showType: '1',
    },
  })
  if (!res) {
    return
  }
  blogList.value = res.data
}
// 属性展示
const treeProps = {
  children: 'children',
  label: 'title',
  value: 'blogId',
}
const blogDrag = () => {}
</script>

<style lang="scss" >
.box-card {
  margin-top: 10px;
}
.tree-panel {
  height: calc(100vh - 265px);
  border: 1px solid red;
  .custom-node-style{
    flex:1
  }
  .custom-node-style {
    display: flex;
    justify-content: space-between;
  }
}
</style>
