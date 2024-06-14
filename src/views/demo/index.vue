<template>
  <el-card shadow="never" class="card-box">
    <!--    查询-->
    <el-form :model="queryForm" label-width="80px">
      <el-row :gutter="20">
        <!--        输入框-->
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="用户名">
            <el-input v-model="queryForm.username" @keyup.enter="onSearch" clearable placeholder="请输入用户名"/>
          </el-form-item>
        </el-col>
        <!--        数字输入框-->
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="手机号码">
            <el-input v-model="queryForm.phone" type="number" clearable maxlength="11" placeholder="请输入手机号码"/>
          </el-form-item>
        </el-col>
        <!--        下拉框-->
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="状态">
            <el-select v-model="queryForm.status" clearable placeholder="请选择状态">
              <el-option label="启用" :value="1"/>
              <el-option label="禁用" :value="0"/>
            </el-select>
          </el-form-item>
        </el-col>
        <!--        多选-->
        <el-col :lg="8" :md="12" :sm="24" :xl="6">
          <el-form-item label="类型">
            <el-checkbox-group v-model="queryForm.typeId">
              <el-checkbox :label="1" border>选项1</el-checkbox>
              <el-checkbox :label="2" border>选项2</el-checkbox>
              <el-checkbox :label="3" border>选项3</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <!--        单选-->
        <el-col :lg="8" :md="12" :sm="24" :xl="6">
          <el-form-item label="类型">
            <el-radio-group v-model="queryForm.typeId">
              <el-radio :label="1" border>选项1</el-radio>
              <el-radio :label="2" border>选项2</el-radio>
              <el-radio :label="3" border>选项3</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!--        日期选择-->
        <el-col :lg="8" :md="12" :sm="24" :xl="6">
          <el-form-item label="创建时间">
            <el-date-picker
                v-model="queryForm.createTime"
                placeholder="请选择创建时间"
            />
          </el-form-item>
        </el-col>
        <!--        日期时间选择-->
        <el-col :lg="8" :md="12" :sm="24" :xl="6">
          <el-form-item label="创建时间">
            <el-date-picker
                v-model="queryForm.createTime"
                type="datetime"
                placeholder="请选择创建时间"
            />
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
    <!--    新 增-->
    <div v-auth="'sys:user:add'" class="table-btn-box mb10">
      <el-button type="primary" @click="openDialog">
        <el-icon class="mr5">
          <ele-circle-plus/>
        </el-icon>
        新 增
      </el-button>
    </div>
    <!--    表格-->
    <el-table :data="tableData.data" border style="width: 100%" row-key="id" @sort-change="sortChange">
      <el-table-column prop="username" label="用户名" align="center"/>
      <el-table-column prop="nickname" label="昵称" align="center"/>
      <el-table-column prop="roleName" label="角色" align="center"/>
      <el-table-column prop="phone" label="手机号码" align="center" width="150"/>
      <el-table-column prop="email" label="邮箱" align="center" width="180"/>
      <el-table-column prop="status" label="状态" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status" type="success" disable-transitions>启用</el-tag>
          <el-tag v-else type="danger" disable-transitions>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" sortable="custom" label="创建时间" align="center" width="180"/>
      <el-table-column label="操作" fixed="right" align="center" width="200">
        <template #default="scope">
          <el-button v-auth="'sys:user:update'" link type="primary" @click="openDialog(scope.row)">
            修改
          </el-button>
          <el-button v-auth="'sys:user:delete'" @click="delTable(scope.row)" link type="danger">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--    分页-->
    <CustomPagination v-model:currentPage="pagination.pageIndex" v-model:pageSize="pagination.pageSize"
                      :total="pagination.total" @changePage="changePage"/>

    <!--    添加，编辑弹框-->
    <TableForm ref="tableDialogRef" @refresh="getTableList"/>

  </el-card>
</template>
<script lang="ts" setup>
import {deleteSysUser, getSysUserList} from "@/api/user";
import {ElMessage, ElMessageBox} from 'element-plus'
import TableForm from './form.vue'

/** 查询*/
let queryForm = ref({})
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
const sortChange = ({column, prop, order}: { order: string }) => {
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
  getSysUserList({...pagination, ...queryForm.value, ...orderBy.value}).then(res => {
    tableData.data = res.list || [];
    pagination.total = res.total;
  })
}
// 删除
const delTable = (row: any) => {
  ElMessageBox.confirm(
      '是否确认删除本条数据？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
      .then(() => {
        deleteSysUser(row.id).then(() => {
          ElMessage.success('删除成功');
          getTableList();
        })
      }).catch(() => {
  })
}


/** 添加，编辑*/
const tableDialogRef = ref()
// 打开弹框
const openDialog = async (row: any = {}) => {
  await tableDialogRef.value.openDialog(row);
}

getTableList();
</script>
<style></style>
