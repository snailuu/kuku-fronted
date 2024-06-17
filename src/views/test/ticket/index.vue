<template>
  <el-card shadow="never" class="card-box">
    <el-form :model="queryForm" label-width="80px">
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="用户id">
            <el-input v-model="queryForm.userId" @keyup.enter="onSearch" clearable placeholder="请输入用户id"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="工单标题">
            <el-input v-model="queryForm.title" @keyup.enter="onSearch" clearable placeholder="请输入工单标题"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="状态">
            <el-select v-model="queryForm.status" clearable placeholder="请选择状态">
              <el-option value="0" label="待确定"/>
              <el-option value="1" label="进行中"/>
              <el-option value="2" label="已完成"/>
              <el-option value="3" label="关闭"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="搜索">
            <el-input v-model="queryForm.keyword" @keyup.enter="onSearch" clearable placeholder="请输入名称"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label-width="0">
            <el-button type="primary" @click="onSearch">
              <el-icon>
                <ele-search/>
              </el-icon>
              <span class="search-btn__left">查询</span>
            </el-button>
            <el-button @click="onReset">
              <el-icon>
                <ele-refresh/>
              </el-icon>
              <span class="search-btn__left">重置</span>
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
  <el-card shadow="never" class="card-box">
    <div v-auth="'ticket:add'" class="table-btn-box mb10">
      <el-button type="primary" @click="openDialog()">
        <el-icon class="mr5">
          <ele-circle-plus/>
        </el-icon>
        新 增
      </el-button>
    </div>
    <el-table v-loading="tableLoading.status"
              :data="tableData.data"
              border
              row-key="id"
              @sort-change="sortChange"
              empty-text="暂无数据"
              :cell-style="cellStyle"
    >
      <el-table-column prop="_tableIndex" label="序号" align="center" width="50px"/>
      <el-table-column prop="uuid" label="工单uuid" align="center" show-overflow-tooltip/>
      <el-table-column prop="userId" label="用户id" align="center" />
      <el-table-column prop="title" label="工单标题" align="center" show-overflow-tooltip/>
      <el-table-column prop="body" label="内容" align="center" show-overflow-tooltip/>
      <el-table-column prop="pictures" label="图片" align="center">
        <template #default="scope">
          <el-image
              v-if="scope.row.pictures?.startsWith('http')"
              style="width: 100px; height: 100px"
              :src="scope.row.pictures"
              :zoom-rate="1.2"
              :max-scale="7"
              :min-scale="0.2"
              preview-teleported="true"
              :preview-src-list="imgSrcList"
              :initial-index="scope.row.index"
              fit="cover"
          />
          <span v-else style="color: #8c939d">
            暂无图片
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <!--          <template #default="scope">-->
          <!--            <el-tag v-if="scope.row.status===true" type="success" disable-transitions>启用</el-tag>-->
          <!--            <el-tag v-else type="danger" disable-transitions>禁用</el-tag>-->
          <!--          </template>-->
          <el-tag v-if="scope.row.status == 0" type="warning">待确定</el-tag>
          <el-tag v-else-if="scope.row.status == 1">进行中</el-tag>
          <el-tag v-else-if="scope.row.status == 2" type="success">已完成</el-tag>
          <el-tag v-else-if="scope.row.status == 3" type="info">关闭</el-tag>
          <el-tag v-else type="info">未知状态</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ticketType" label="工单类型" align="center" show-overflow-tooltip/>
      <el-table-column prop="contactEmail" label="联系邮箱" align="center" show-overflow-tooltip/>
      <el-table-column prop="contactPhone" label="联系手机号" align="center" show-overflow-tooltip/>
      <el-table-column label="操作" fixed="right" align="center" min-width="116">
        <template #default="scope">
          <el-button v-auth="'ticket:update'" link type="primary" @click="openDialog(scope.row.id)">
            <el-icon>
              <ele-edit/>
            </el-icon>
            修改
          </el-button>
          <el-button v-auth="'ticket:delete'" link type="primary" @click="delTable(scope.row.id)">
            <el-icon>
              <ele-delete/>
            </el-icon>
            删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <CustomPagination v-model:currentPage="pagination.pageIndex" v-model:pageSize="pagination.pageSize"
                      :total="pagination.total" @changePage="changePage"/>

    <TableForm ref="tableDialogRef" @refresh="getTableList"/>

  </el-card>
</template>
<script lang="ts" setup>
import {deleteTicket, getTicketPage} from "@/api/test/ticket";
import {ElMessage, ElMessageBox} from 'element-plus'
import TableForm from './form.vue'
import {calcTableIndex} from "@/utils/util";
/** 查询参数 **/
let queryForm: any = ref({
  keyword: null,
  userId: null,
  title: null,
  status: null,
});

const tableLoading = ref({
  status: false
})

// 图片预览列表
const imgSrcList = ref([]);
// 表格字段为空操作
const cellStyle= ({ row, column, rowIndex, columnIndex })=> {
  if (row[column.property] == null) {
    row[column.property] = '--'
    return{
      color: '#a51a1a'
    }
  }
  return {}

}
// 查询
const onSearch = () => {
  pagination.pageIndex = 1;
  getTableList();
}
// 重置
const onReset = () => {
  queryForm.value = {}
  pagination.pageIndex = 1;
  getTableList();
}

/** 分页*/
// 分页数据
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 0
})
// 翻页
const changePage = (page: number) => {
  pagination.pageIndex = page;
  getTableList();
}

/** 排序*/
const orderBy = ref({})
// 排序
const sortChange = ({column, prop, order}) => {
  if (order) {
    orderBy.value.orderByColumn = prop;
    orderBy.value.orderByAsc = order === "ascending";
  } else {
    orderBy.value = {}
  }
  pagination.pageIndex = 1;
  getTableList();
}

/** 表格*/
// 表格数据
const tableData = reactive({
  data: [],
})
// 获取表格列表
const getTableList = () => {
  tableLoading.value.status = true;
  getTicketPage({...pagination, ...queryForm.value, ...orderBy.value}).then(res => {
    tableData.data = calcTableIndex(res, pagination);
    imgSrcList.value = tableData.data.map(item => item.pictures);
    console.log(imgSrcList)
    pagination.total = res.total;
    tableLoading.value.status = false;
  })
}
// 删除
const delTable = (id: string) => {
  ElMessageBox.confirm(
      '是否确认删除本条数据？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        deleteTicket(id).then(() => {
          ElMessage.success('删除成功');
          getTableList();
        })
      }).catch(() => {
  })
}

/** 添加，编辑*/
const tableDialogRef = ref()
// 打开弹框
const openDialog = async (id: string) => {
  await tableDialogRef.value.openDialog(id);
}

getTableList();
</script>
<style scoped>
.card-box{
  margin: 20px;
}
.el-image {
  width: 50vw;
  height: 200px;
}
</style>
