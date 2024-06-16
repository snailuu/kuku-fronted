<template>
  <el-dialog :model-value="dialogData.isShow" :title="dialogData.id?'编辑':'新增'"
             @close="closeDialog" draggable>
    <el-form :model="form" ref="formRef" :rules="rules" label-width="90px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="值班安排" prop="arrangeType">
            <el-select v-model="form.arrangeType" clearable placeholder="请选择值班安排">
              <el-option label="早班" value="1"/>
              <el-option label="午班" value="2"/>
              <el-option label="晚班" value="3"/>
            </el-select>
          </el-form-item>
        </el-col>
         <el-col :span="12">
           <el-form-item label="值班人员" prop="userId">
             <el-select
                 v-model="form.userId"
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
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="值班日期">
            <el-date-picker v-model="form.workingDate" value-format="YYYY-MM-DD" type="date" placeholder="请选择值班日期"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="值班状态" prop="status">
            <el-select v-model="form.status" clearable placeholder="请选择值班状态">
              <el-option value="1" label="计划中"/>
              <el-option value="2" label="进行中"/>
              <el-option value="3" label="已打卡"/>
              <el-option value="4" label="缺勤"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="closeDialog">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {addWorkingSchedule, getWorkingSchedule, updateWorkingSchedule} from "@/api/test/workingSchedule";
import {useDebounceFn} from "@vueuse/core";
import {getSysUserListByNickname} from "@/api/user";

const formRef = ref<FormInstance>()

const emits = defineEmits<{
  (event: 'refresh'): void
}>()



// 表单
let form: any = ref({
    id: null,
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

/** 分页*/
// 分页数据
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 0
})
const orderBy = ref({})
const getUserListByNickname = useDebounceFn((nickname: string) => {
  userListLoading.status = true;
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


// 效验规则
const rules = reactive<FormRules>({
  arrangeType: [
    {required: true, message: '请选择值班安排', trigger: 'blur'},
  ],
  userId: [
    {required: true, message: '请输入值班人员', trigger: 'blur'},
  ],
})

// 获取详情
const getDetails = (id: string) => {
  getWorkingSchedule(id).then(res => {
    form.value = Object.assign({}, form.value, res);
  })
}

// 弹框数据
const dialogData = reactive({
  isShow: false,
  id: null
})

// 打开弹框
const openDialog = async (id: string) => {
  dialogData.isShow = true;
  dialogData.title = '新增人员排班';
  if (id) {
    dialogData.id = id;
    dialogData.title = '编辑人员排班';
    getDetails(id);
  }
}

// 关闭弹框
const closeDialog = () => {
  dialogData.isShow = false;
  form.value = {};
}
// 提交

const submit = async () => {
   if (!formRef.value) return;
   await formRef.value.validate((valid: any) => {
   if (valid) {
       let data = form.value;
     if (data.id) {
       updateWorkingSchedule({...data}).then(() => {
         ElMessage.success('操作成功');
         closeDialog();
         emits('refresh');
       })
     } else {
       addWorkingSchedule({...data}).then(() => {
       ElMessage.success('操作成功');
       closeDialog();
       emits('refresh');
       })
     }
   }
  })
}

defineExpose({
  openDialog,
});
</script>

<style scoped>

</style>
