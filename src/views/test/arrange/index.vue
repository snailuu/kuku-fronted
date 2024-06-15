<template>
  <el-card shadow="never" class="card-box">
    <el-form :model="queryForm" label-width="80px">
      <el-row :gutter="20">
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="班次类型">
            <el-select v-model="queryForm.type" clearable placeholder="请选择班次类型">
              <el-option label="早班" value="1"/>
              <el-option label="午班" value="2"/>
              <el-option label="晚班" value="3"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="早班开始">
            <el-input v-model="queryForm.morningBegin" @keyup.enter="onSearch" clearable placeholder="请输入早班开始"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="早班结束">
            <el-input v-model="queryForm.morningEnd" @keyup.enter="onSearch" clearable placeholder="请输入早班结束"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="午班开始">
            <el-input v-model="queryForm.afternoonBegin" @keyup.enter="onSearch" clearable placeholder="请输入午班开始"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="午班结束">
            <el-input v-model="queryForm.afternoonEnd" @keyup.enter="onSearch" clearable placeholder="请输入午班结束"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="晚班开始">
            <el-input v-model="queryForm.nightBegin" @keyup.enter="onSearch" clearable placeholder="请输入晚班开始"/>
          </el-form-item>
        </el-col>
        <el-col :sm="24" :md="12" :lg="8" :xl="6">
          <el-form-item label="晚班结束">
            <el-input v-model="queryForm.nightEnd" @keyup.enter="onSearch" clearable placeholder="请输入晚班结束"/>
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
    <div v-auth="'arrange:add'" class="table-btn-box mb10">
      <el-button type="primary" @click="openDialog()">
        <el-icon class="mr5">
          <ele-circle-plus/>
        </el-icon>
        新 增
      </el-button>
    </div>
    <el-table v-loading="tableLoading.status" :data="tableData.data" border row-key="id" @sort-change="sortChange">
      <el-table-column prop="_tableIndex" label="序号" align="center" width="50px"/>
      <el-table-column prop="type" label="班次类型" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.type == 1" type="primary">早班</el-tag>
          <el-tag v-else-if="scope.row.type == 2" type="success">午班</el-tag>
          <el-tag v-else-if="scope.row.type == 3" type="warning">晚班</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="morningBegin" label="早班开始" align="center" show-overflow-tooltip/>
      <el-table-column prop="morningEnd" label="早班结束" align="center" show-overflow-tooltip/>
      <el-table-column prop="afternoonBegin" label="午班开始" align="center" show-overflow-tooltip/>
      <el-table-column prop="afternoonEnd" label="午班结束" align="center" show-overflow-tooltip/>
      <el-table-column prop="nightBegin" label="晚班开始" align="center" show-overflow-tooltip/>
      <el-table-column prop="nightEnd" label="晚班结束" align="center" show-overflow-tooltip/>
      <el-table-column label="操作" fixed="right" align="center" min-width="116">
        <template #default="scope">
          <el-button v-auth="'arrange:update'" link type="primary" @click="openDialog(scope.row.id)">
            <el-icon>
              <ele-edit/>
            </el-icon>
            修改
          </el-button>
          <el-button v-auth="'arrange:delete'" link type="primary" @click="delTable(scope.row.id)">
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
import {deleteArrange, getArrangePage} from "@/api/test/arrange";
import {ElMessage, ElMessageBox} from 'element-plus'
import TableForm from './form.vue'
import {calcTableIndex} from "@/utils/util";

/** 查询参数 **/
let queryForm: any = ref({
    keyword: null,
    type: null,
    morningBegin: null,
    morningEnd: null,
    afternoonBegin: null,
    afternoonEnd: null,
    nightBegin: null,
    nightEnd: null,
});

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
    getArrangePage({...pagination, ...queryForm.value, ...orderBy.value}).then(res => {
        tableData.data = calcTableIndex(res, pagination);;
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
                deleteArrange(id).then(() => {
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

</style>
