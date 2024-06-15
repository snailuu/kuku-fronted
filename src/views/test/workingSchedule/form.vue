<template>
  <el-dialog :model-value="dialogData.isShow" :title="dialogData.id?'编辑':'新增'"
             @close="closeDialog" draggable>
    <el-form :model="form" ref="formRef" :rules="rules" label-width="90px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="值班安排" prop="arrangeId">
            <el-input type="number" v-model="form.arrangeId" placeholder="请输入值班安排"/>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="值班人员" prop="userId">
            <el-input type="number" v-model="form.userId" placeholder="请输入值班人员"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="值班日期">
            <el-date-picker v-model="form.workingDate" type="date" placeholder="请选择值班日期"/>
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

const formRef = ref<FormInstance>()

const emits = defineEmits<{
  (event: 'refresh'): void
}>()

// 表单
let form: any = ref({
    id: null,
    arrangeId: null,
    userId: null,
    workingDate: null,
    status: null,
});

// 效验规则
const rules = reactive<FormRules>({
  arrangeId: [
    {required: true, message: '请输入值班安排', trigger: 'blur'},
  ],
  userId: [
    {required: true, message: '请输入值班人员', trigger: 'blur'},
  ],
  workingDate: [
    {required: true, message: '请选择值班日期', trigger: 'blur'},
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
  dialogData.title = '新增人员排班表';
  if (id) {
    dialogData.id = id;
    dialogData.title = '编辑人员排班表';
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
