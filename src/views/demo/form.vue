<template>
  <el-dialog :model-value="dialogData.isShow" destroy-on-close :title="dialogData.id?'编辑':'新增'" @close="closeDialog">
    <el-form :model="form" ref="formRef" :rules="rules" label-width="90px">
      <el-row :gutter="10">
        <!--        输入框-->
        <el-col :span="12">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"/>
          </el-form-item>
        </el-col>
        <!--        下拉框-->
        <el-col :span="12">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="form.roleId" clearable placeholder="请选择角色">
              <el-option label="角色1" :value="1"/>
              <el-option label="角色2" :value="2"/>
              <el-option label="角色3" :value="3"/>
            </el-select>
          </el-form-item>
        </el-col>
        <!--        单选框-->
        <el-col :span="12">
          <el-form-item label="性别">
            <el-radio-group v-model="form.gender">
              <el-radio :label="1" border>男</el-radio>
              <el-radio :label="0" border>女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!--        多选框-->
        <el-col :span="12">
          <el-form-item label="类型">
            <el-checkbox-group v-model="form.typeId">
              <el-checkbox :label="1" border>类型1</el-checkbox>
              <el-checkbox :label="2" border>类型2</el-checkbox>
              <el-checkbox :label="3" border>类型3</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <!--        日期选择器-->
        <el-col :span="12">
          <el-form-item label="日期">
            <el-date-picker v-model="form.date" type="date" placeholder="选择日期"/>
          </el-form-item>
        </el-col>
        <!--        时间选择器-->
        <el-col :span="12">
          <el-form-item label="时间">
            <el-time-picker value-format="HH:mm:ss" v-model="form.time" placeholder="选择时间"/>
          </el-form-item>
        </el-col>
        <!--        日期时间选择器-->
        <el-col :span="12">
          <el-form-item label="日期时间">
            <el-date-picker v-model="form.datetime" type="datetime" placeholder="选择日期时间"/>
          </el-form-item>
        </el-col>
        <!--              文本域-->
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
        <!--        上传图片-->
        <el-col :span="24">
          <el-form-item label="上传">
            <Upload v-model="form.url" type="image"/>
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
import {addSysUser, getSysUser, updateSysUser} from "@/api/user";
import Upload from "@/components/Upload/index.vue";

const formRef = ref<FormInstance>()

const emits = defineEmits<{
  (event: 'refresh'): void
}>()

// 表单
let form: any = ref({})
// 效验规则
const rules = reactive<FormRules>({
  username: [
    {required: true, message: '请输入用户名', trigger: 'blur'},
  ],
})

// 获取详情
const getDetails = (id: string) => {
  getSysUser(id).then(res => {
    form.value = Object.assign({}, form.value, res);
  })
}

// 弹框数据
const dialogData = reactive({
  isShow: false,
  id: null
})
// 打开弹框
const openDialog = async (id?: string) => {
  dialogData.isShow = true;
  if (id) {
    dialogData.id = id;
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
  const valid = await formRef.value.validate().catch(() => {
  });
  if (!valid) return false;
  dialogData.id ? await updateSysUser(form.value) : await addSysUser(form.value);
  ElMessage.success(dialogData.id ? '修改成功' : '添加成功');
  emits('refresh');
}

defineExpose({
  openDialog,
});
</script>

<style scoped>

</style>
