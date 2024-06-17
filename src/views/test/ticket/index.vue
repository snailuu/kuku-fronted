<template>
  <el-card shadow="never" class="card-box">

    <el-form :model="queryForm" label-width="80px">
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8" :xl="6" v-if="isAdmin">
          <el-form-item label="值班人员">
            <el-select v-model="queryForm.userId" filterable remote reserve-keyword clearable placeholder="请输入值班人员姓名"
              :remote-method="getUserListByNickname" :loading="userListLoading.status">
              <el-option v-for="item in userList" :key="item.id" :label="item.nickname" :value="item.id">
                <div class="flex items-between">
                  <span>{{ item.nickname }}</span>

                  <span style="color: rgba(167,167,167,0.91);margin-left: 1em;font-size: 0.9em">id={{ item.id }}</span>
                </div>
              </el-option>
              <template #loading>
                <svg class="circular" viewBox="0 0 50 50">
                  <circle class="path" cx="25" cy="25" r="20" fill="none" />
                </svg>
              </template>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="工单标题">
            <el-input v-model="queryForm.title" @keyup.enter="onSearch" clearable placeholder="请输入工单标题" />
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="状态">
            <el-select v-model="queryForm.status" clearable placeholder="请选择状态">
              <el-option value="0" label="待确定" />
              <el-option value="1" label="进行中" />
              <el-option value="2" label="已完成" />
              <el-option value="3" label="关闭" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label-width="0">
            <el-button type="primary" @click="onSearch">
              <el-icon>
                <ele-search />
              </el-icon>
              <span class="search-btn__left">查询</span>
            </el-button>
            <el-button @click="onReset">
              <el-icon>
                <ele-refresh />
              </el-icon>
              <span class="search-btn__left">重置</span>
            </el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
  <el-card shadow="never" class="card-box">
    <div v-auth="'ticket:add'" class="table-btn-box mb10" v-if="isAdmin">
      <el-button type="primary" @click="openDialog()">
        <el-icon class="mr5">
          <ele-circle-plus />
        </el-icon>
        新 增
      </el-button>
    </div>
    <el-table v-loading="tableLoading.status" :data="tableData.data" border row-key="id" @sort-change="sortChange"
      empty-text="暂无数据" :cell-style="cellStyle">
      <el-table-column prop="_tableIndex" label="序号" align="center" width="50px" />
      <el-table-column prop="uuid" label="工单uuid" align="center" show-overflow-tooltip />
      <el-table-column prop="userId" label="用户id" align="center" v-if="isAdmin" />
      <el-table-column prop="title" label="工单标题" align="center" show-overflow-tooltip />
      <el-table-column prop="body" label="内容" align="center" show-overflow-tooltip />
      <el-table-column prop="pictures" label="图片" align="center">
        <template #default="scope">
          <el-image v-if="scope.row.pictures?.startsWith('http')" style="width: 100px; height: 100px"
            :src="scope.row.pictures" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" preview-teleported="true"
            :preview-src-list="imgSrcList" :initial-index="scope.$index" fit="cover" lazy loading="lazy" />
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
      <el-table-column prop="ticketType" label="工单类型" align="center" show-overflow-tooltip>
        <template #default="scope">
          <el-tag v-if="scope.row.ticketType == 1" :type="getRandomType()">水管漏水</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 2" :type="getRandomType()">电路故障</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 3" :type="getRandomType()">煤气泄漏</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 4" :type="getRandomType()">电梯故障</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 5" :type="getRandomType()">空调维修</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 6" :type="getRandomType()">门禁系统故障</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 7" :type="getRandomType()">公共设施损坏</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 8" :type="getRandomType()">停车场设备故障</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 9" :type="getRandomType()">道路维修</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 10" :type="getRandomType()">电脑硬件故障</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 11" :type="getRandomType()">打印机维修</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 12" :type="getRandomType()">网络故障</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 13" :type="getRandomType()">生产线设备故障</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 14" :type="getRandomType()">工厂设备保养</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 15" :type="getRandomType()">仪器仪表维修</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 16" :type="getRandomType()">变压器故障</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 17" :type="getRandomType()">发电机维护</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 18" :type="getRandomType()">配电柜维修</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 19" :type="getRandomType()">应用程序故障</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 20" :type="getRandomType()">软件更新与安装</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 21" :type="getRandomType()">数据恢复</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 22" :type="getRandomType()">服务器故障</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 23" :type="getRandomType()">硬盘损坏</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 24" :type="getRandomType()">设备连接问题</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 25" :type="getRandomType()">网络中断</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 26" :type="getRandomType()">路由器配置</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 27" :type="getRandomType()">防火墙问题</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 28" :type="getRandomType()">安防系统故障</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 29" :type="getRandomType()">监控设备维修</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 30" :type="getRandomType()">垃圾清理</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 31" :type="getRandomType()">下水道堵塞</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 32" :type="getRandomType()">消毒杀菌</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 33" :type="getRandomType()">车辆故障</el-tag>
          <el-tag v-else-if="scope.row.ticketType == 34" :type="getRandomType()">交通信号设备维修</el-tag>
          <el-tag v-else type="info">未知类型</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="contactEmail" label="联系邮箱" align="center" show-overflow-tooltip />
      <el-table-column prop="contactPhone" label="联系手机号" align="center" show-overflow-tooltip />
      <el-table-column label="操作" fixed="right" align="center" min-width="116" v-if="isAdmin">
        <template #default="scope">
          <el-button v-auth="'ticket:update'" link type="primary" @click="openDialog(scope.row.id)">
            <el-icon>
              <ele-edit />
            </el-icon>
            修改
          </el-button>
          <el-button v-auth="'ticket:delete'" link type="primary" @click="delTable(scope.row.id)">
            <el-icon>
              <ele-delete />
            </el-icon>
            删除
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <CustomPagination v-model:currentPage="pagination.pageIndex" v-model:pageSize="pagination.pageSize"
      :total="pagination.total" @changePage="changePage" />

    <TableForm ref="tableDialogRef" @refresh="getTableList" />

  </el-card>
</template>
<script lang="ts" setup>
import { deleteTicket, getTicketPage } from "@/api/test/ticket";
import { ElMessage, ElMessageBox } from 'element-plus'
import TableForm from './form.vue'
import { calcTableIndex } from "@/utils/util";
import { useUserStore } from "@/store/modules/user";
import { useDebounceFn } from "@vueuse/core";
import { getSysUserListByNickname } from "@/api/user";
/** 查询参数 **/
let queryForm: any = ref({
  keyword: null,
  userId: null,
  title: null,
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
    getSysUserListByNickname({ ...pagination, nickname, ...orderBy.value })
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

// 图片预览列表
const imgSrcList = ref([]);
// 表格字段为空操作
const cellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (row[column.property] == null) {
    row[column.property] = '--'
    return {
      color: '#a51a1a'
    }
  }
  return {}

}

const getRandomType = () => {
  // const types = ["primary", "success", "info", "warning", "danger"];
  // const randomIndex = Math.floor(Math.random() * types.length);
  // return types[randomIndex];
  return "primary"
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
const sortChange = ({ column, prop, order }) => {
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

// 当前用户id以及是否是管理员
const { userid, isAdmin } = useUserStore();


// 获取表格列表
const getTableList = () => {
  tableLoading.value.status = true;
  if (!isAdmin) {
    queryForm.value.userId = userid;
  }
  console.log(userid, isAdmin);
  getTicketPage({ ...pagination, ...queryForm.value, ...orderBy.value }).then(res => {
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
.card-box {
  margin: 20px;
}

.el-image {
  width: 50vw;
  height: 200px;
}
</style>
