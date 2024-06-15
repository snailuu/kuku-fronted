<template>
  <el-dialog :model-value="dialogData.isShow" :title="dialogData.id?'编辑':'新增'"
             @close="closeDialog" draggable>
    <el-form :model="form" ref="formRef" :rules="rules" label-width="90px">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="班次类型" prop="type">
            <el-select v-model="form.type" clearable placeholder="请选择班次类型">
              <el-option label="早班" :value="1"/>
              <el-option label="午班" :value="2"/>
              <el-option label="晚班" :value="3"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
         <el-col :span="12">
           <el-form-item label="早班结束" prop="morningEnd">
             <el-time-picker value-format="HH:mm:ss" v-model="form.morningEnd" maxlength="" placeholder="请输入早班结束"/>
           </el-form-item>
         </el-col>
         <el-col :span="12">
           <el-form-item label="午班开始" prop="afternoonBegin">
             <el-time-picker value-format="HH:mm:ss" v-model="form.afternoonBegin" maxlength="" placeholder="请输入午班开始"/>
           </el-form-item>
         </el-col>
      </el-row>
      <el-row :gutter="10">
         <el-col :span="12">
           <el-form-item label="午班结束" prop="afternoonEnd">
             <el-time-picker value-format="HH:mm:ss" v-model="form.afternoonEnd" maxlength="" placeholder="请输入午班结束"/>
           </el-form-item>
         </el-col>
         <el-col :span="12">
           <el-form-item label="晚班开始" prop="nightBegin">
             <el-time-picker value-format="HH:mm:ss" v-model="form.nightBegin" maxlength="" placeholder="请输入晚班开始"/>
           </el-form-item>
         </el-col>
      </el-row>
      <el-row :gutter="10">
         <el-col :span="12">
           <el-form-item label="晚班结束" prop="nightEnd">
             <el-time-picker value-format="HH:mm:ss" v-model="form.nightEnd" maxlength="" placeholder="请输入晚班结束"/>
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
import {addArrange, getArrange, updateArrange} from "@/api/test/arrange";

const formRef = ref<FormInstance>()

const emits = defineEmits<{
  (event: 'refresh'): void
}>()

// 表单
let form: any = ref({
    id: null,
    type: null,
    morningBegin: null,
    morningEnd: null,
    afternoonBegin: null,
    afternoonEnd: null,
    nightBegin: null,
    nightEnd: null,
});

// 效验规则
const rules = reactive<FormRules>({
})

// 获取详情
const getDetails = (id: string) => {
  getArrange(id).then(res => {
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
  dialogData.title = '新增值班安排';
  if (id) {
    dialogData.id = id;
    dialogData.title = '编辑值班安排';
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
       updateArrange({...data}).then(() => {
         ElMessage.success('操作成功');
         closeDialog();
         emits('refresh');
       })
     } else {
       addArrange({...data}).then(() => {
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
