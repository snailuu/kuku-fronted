<template>
  <el-card shadow="never" class="card-box">
    <el-form :model="queryForm" label-width="80px">
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="值班安排">
            <el-select v-model="queryForm.arrangeType" clearable placeholder="请选择值班安排">
              <el-option label="早班" value="1"/>
              <el-option label="午班" value="2"/>
              <el-option label="晚班" value="3"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <!--          <el-form-item label="值班人员">-->
          <!--            <el-input v-model="queryForm.userId" @input="getUserListByNickname(queryForm.userId)" clearable placeholder="请输入值班人员"/>-->
          <!--          </el-form-item>-->
          <el-form-item label="值班人员">

          <el-select
              v-model="queryForm.userId"
              filterable
              remote
              reserve-keyword
              clearable

              placeholder="请输入值班人员姓名"
              :remote-method="getUserListByNickname"
              :loading="userListLoading.status"
          >

            <el-option
                v-for="item in userList"
                :key="item.id"
                :label="item.nickname"
                :value="item.id"
            >
              <div class="flex items-between">
                <span>{{ item.nickname }}</span>

                <span style="color: rgba(167,167,167,0.91);margin-left: 1em;font-size: 0.9em">id={{ item.id }}</span>
              </div>
            </el-option>
            <template #loading>
              <svg class="circular" viewBox="0 0 50 50">
                <circle class="path" cx="25" cy="25" r="20" fill="none"/>
              </svg>
            </template>
          </el-select>
          </el-form-item>
        </el-col>
        <el-col :lg="8" :md="12" :sm="24" :xl="6">
          <el-form-item label="值班日期">
            <custom-date-picker type="daterange" v-model:startDate="queryForm.workingDateStart"
                                v-model:endDate="queryForm.workingDateEnd"
                                clearable start-placeholder="开始时间"
                                end-placeholder="结束时间"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="值班状态">
            <el-select v-model="queryForm.status" clearable placeholder="请选择值班状态">
              <el-option value="1" label="计划中"/>
              <el-option value="2" label="进行中"/>
              <el-option value="3" label="已打卡"/>
              <el-option value="4" label="缺勤"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
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
    <div v-auth="'working:schedule:add'" class="table-btn-box mb10">
      <el-button type="primary" @click="openDialog()">
        <el-icon class="mr5">
          <ele-circle-plus/>
        </el-icon>
        新 增
      </el-button>
    </div>
    <el-table v-loading="tableLoading.status" :data="tableData.data" border row-key="id" @sort-change="sortChange">
      <el-table-column prop="_tableIndex" label="序号" align="center" width="50px"/>
      <el-table-column prop="arrangeType" label="值班安排" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.arrangeType == 1" type="warning">早班</el-tag>
          <el-tag v-else-if="scope.row.arrangeType == 2">午班</el-tag>
          <el-tag v-else-if="scope.row.arrangeType == 3" type="success">晚班</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="值班人员" align="center" show-overflow-tooltip/>
      <el-table-column prop="workingDate" label="值班日期" align="center" min-width="150"/>
      <el-table-column prop="status" label="值班状态" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status == 1" type="info">计划中</el-tag>
          <el-tag v-else-if="scope.row.status == 2">进行中</el-tag>
          <el-tag v-else-if="scope.row.status == 3" type="success">已完成</el-tag>
          <el-tag v-else-if="scope.row.status == 4" type="warning">缺勤</el-tag>
          <el-tag v-else type="info">未知状态</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="center" min-width="116">
        <template #default="scope">
          <el-button v-auth="'working:schedule:update'" link type="primary" @click="openDialog(scope.row.id)">
            <el-icon>
              <ele-edit/>
            </el-icon>
            修改
          </el-button>
          <el-button v-auth="'working:schedule:delete'" link type="primary" @click="delTable(scope.row.id)">
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
import {deleteWorkingSchedule, getWorkingSchedulePage} from "@/api/test/workingSchedule";
import {ElMessage, ElMessageBox} from 'element-plus'
import TableForm from './form.vue'
import {calcTableIndex} from "@/utils/util";
import {useDebounceFn} from "@vueuse/core";
import {getSysUserListByNickname} from "@/api/user";


/** 查询参数 **/
let queryForm: any = ref({
  keyword: null,
  arrangeType: null,
  userId: null,
  workingDate: null,
  status: null,
});

// 值班人员模糊查询临时列表
const userList = ref([]);
const userListLoading = ref({
  status: false
})



const getUserListByNickname = useDebounceFn((nickname: string) => {
  userListLoading.status = true;
  pagination.pageIndex = 1;
  if (nickname) {
    getSysUserListByNickname({...pagination, nickname, ...orderBy.value})
        .then(res => {
          userList.value = res.list;
        })
  } else {
    userList.value = [];
  }
  userListLoading.status = false;

}, 300)


const tableLoading = ref({
  status: false
})

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
  getWorkingSchedulePage({...pagination, ...queryForm.value, ...orderBy.value}).then(res => {
    tableData.data = calcTableIndex(res, pagination);
    for (let i = 0; i < tableData.data.length; i++) {
      tableData.data[i].workingDate = tableData.data[i].workingDate.split(" ")[0];
    }
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
        deleteWorkingSchedule(id).then(() => {
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
.circular {
  display: inline;
  height: 30px;
  width: 30px;
  animation: loading-rotate 2s linear infinite;
}

.path {
  animation: loading-dash 1.5s ease-in-out infinite;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-width: 2;
  stroke: var(--el-color-primary);
  stroke-linecap: round;
}
.card-box{
  margin: 20px;
}

</style>
