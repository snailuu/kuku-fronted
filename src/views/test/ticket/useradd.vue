<template>
    <el-card style="width: 800px;height: 550px; margin: 50px auto;">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="90px" style="padding-top: 20px;">
            <el-row :gutter="10">
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
                    <el-form-item label="工单类型" prop="ticketType">
                        <el-input v-model="form.ticketType" maxlength="4" placeholder="请输入工单类型" />
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
        <div style="width: 200px; height: 50px;margin: 10px auto;">
            <el-button type="primary" @click="submit">确定</el-button>
            <el-button @click="closeDialog">取消</el-button>
        </div>
    </el-card>

</template>

<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { addTicket, getTicket, updateTicket } from "@/api/test/ticket";
import Upload from "@/components/Upload/index.vue";
import { store } from '@/store'
import { useUserStore } from "@/store/modules/user";
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
    status: 0,
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
    if (!regex.email.test(form.value.contactEmail)) {
        ElMessage.error('邮箱格式不正确,仅支持163和qq邮箱');
        return;
    }
    const user = await useUserStore();
    form.value.userId = user.userid;
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
const regex = {
    email: /^([A-Za-z0-9_\-\.])+\@(163.com|qq.com|42du.cn)$/,
}
defineExpose({
    openDialog,
});
</script>

<style scoped></style>