<template>
  <el-dialog :model-value="dialogData.isShow" :title="dialogData.id ? '编辑' : '新增'" @close="closeDialog" draggable>
    <el-form :model="form" ref="formRef" :rules="rules" label-width="90px">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="负责人" prop="userId">
            <el-select v-model="form.userId" filterable remote reserve-keyword clearable
                       placeholder="输入值班人员姓名进行搜索"
              :remote-method="getUserListByNickname" :loading="userListLoading.status"
            >
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
        <el-col :span="24">
          <el-form-item label="工单标题" prop="title">
            <el-input v-model="form.title" maxlength="128" placeholder="请输入工单标题" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="内容" prop="body">
            <el-input type="textarea" v-model="form.body" maxlength="" placeholder="请输入内容" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="图片" prop="pictures">
            <Upload v-model:value="form.pictures" type="head" :customStyle="{}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="状态" prop="status">
            <el-select v-model="form.status" clearable placeholder="请选择状态">
              <el-option value="0" label="待确定" />
              <el-option value="1" label="进行中" />
              <el-option value="2" label="已完成" />
              <el-option value="3" label="关闭" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="工单类型">
            <el-select v-model="form.ticketType" placeholder="请输入工单类型">
              <el-option v-for="item in tickList" :key="item.id" :label="item.nickname" :value="item.id">
                <div class="flex items-between">
                  <span>{{ item.name }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系邮箱" prop="contactEmail">
            <el-input v-model="form.contactEmail" maxlength="128" placeholder="请输入联系邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="联系手机号" prop="contactPhone">
            <el-input v-model="form.contactPhone" maxlength="128" placeholder="请输入联系手机号" />
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
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { addTicket, getTicket, updateTicket } from "@/api/test/ticket";
import Upload from "@/components/Upload/index.vue";
import { store } from '@/store'
import { useUserStore } from "@/store/modules/user";
import { useDebounceFn } from "@vueuse/core";
import { getSysUserListByNickname } from "@/api/user";
import { getTypeTicket, getTypeTicketPage } from "@/api/test/typeTicket";

const formRef = ref<FormInstance>()

const emits = defineEmits<{
  (event: 'refresh'): void
}>()

// 表单
let form: any = ref({
  id: null,
  uuid: null,
  userId: null,
  title: null,
  body: null,
  pictures: null,
  status: null,
  ticketType: null,
  contactEmail: null,
  contactPhone: null,
  createdBy: null,
  createdTime: null,
  updatedBy: null,
  updatedTime: null,
});

// 效验规则
const rules = reactive<FormRules>({
  title: [
    { required: true, message: '请输入工单标题', trigger: 'blur' },
  ],
  body: [
    { required: true, message: '请输入内容', trigger: 'blur' },
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'blur' },
  ],
  ticketType: [
    { required: true, message: '请输入工单类型', trigger: 'blur' },
  ],
  contactEmail: [
    { required: true, message: '请输入联系邮箱', trigger: 'blur' },
  ],
})

// 获取详情
const getDetails = (id: string) => {
  getTicket(id).then(res => {
    form.value = Object.assign({}, form.value, res);
  })
}

// 弹框数据
const dialogData = reactive({
  isShow: false,
  id: null
})

// 值班人员模糊查询临时列表
const userList = ref([]);
const userListLoading = ref({
  status: false
})

const tickList = ref([]);
const tickListLoading = ref({
  status: false
})

/** 分页*/
// 分页数据
const pagination = reactive({
  pageIndex: 1,
  pageSize: 10,
  total: 0
})


/** 排序*/
const orderBy = ref({})

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

const getTicketNameList = useDebounceFn((nickname: string) => {
  tickListLoading.status = true;
  pagination.pageIndex = 1;
  pagination.pageSize = 100;

  if (nickname) {
    getTypeTicketPage({ ...pagination, nickname, ...orderBy.value })
      .then(res => {
        tickList.value = res.list;
      })
  } else {
    tickList.value = [];
  }
  tickListLoading.status = false;
  pagination.pageSize = 10;

}, 300)

// 打开弹框
const openDialog = async (id: string) => {
  dialogData.isShow = true;
  dialogData.title = '新增工单';
  if (id) {
    dialogData.id = id;
    dialogData.title = '编辑工单';
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
  const user = await useUserStore();
  form.updatedBy = user.userid;
  await formRef.value.validate((valid: any) => {
    if (valid) {
      let data = form.value;
      if (data.id) {
        updateTicket({ ...data }).then(() => {
          ElMessage.success('操作成功');
          closeDialog();
          emits('refresh');
        })
      } else {
        form.createdBy = user.userid;
        addTicket({ ...data }).then(() => {
          ElMessage.success('操作成功');
          closeDialog();
          emits('refresh');
        })
      }
    }
  })
}
const getTicktType = async () => {
  try {
    pagination.pageIndex = 1;
    pagination.pageSize = 100;
    const res = await getTypeTicketPage({ ...pagination })
    console.log(res);
    tickList.value = res.list
  } catch (e) {
    console.log(e);

  }
}
onMounted(() => {
  getTicktType()
})
defineExpose({
  openDialog,
});
</script>

<style scoped></style>
