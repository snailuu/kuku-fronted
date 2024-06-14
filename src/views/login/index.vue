<template>
  <div class="container">
    <div class="form-box">
      <div class="form">
        <div class="sys-name mb30 flex-center"><img class="logo-img mr5" src="@/assets/logo.png" alt="">spring-boot-plus管理后台</div>
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
          <el-form-item class="mb25" prop="username">
            <el-input style="width: 300px" :prefix-icon="User" clearable v-model="ruleForm.username" placeholder="请输入用户名"/>
          </el-form-item>
          <el-form-item class="mb25" prop="password">
            <el-input :prefix-icon="Lock" show-password clearable v-model="ruleForm.password"
                      placeholder="请输入密码"/>
          </el-form-item>
          <el-button size="large" type="primary" round @click="login">登录</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useUserStoreHook} from "@/store/modules/user";
import {Lock, User} from "@element-plus/icons-vue"
import md5 from "js-md5"
import {NextLoading} from "@/utils/loading"

const router = useRouter();

const ruleForm = reactive({
  username: '',
  password: ''
})
const rules = reactive({
  username: [{
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  },],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },],
})
const login = () => {
  useUserStoreHook().login({
    username: ruleForm.username,
    password: md5(ruleForm.password)
  }).then(async () => {
    NextLoading.start();
    await router.push('/')
  })
}
// 页面加载时
onMounted(() => {
  NextLoading.done();
});
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: url("../../assets/login-bg.png") no-repeat center / cover;

  .form-box{
    width: 1150px;
    margin: auto;
    height: 600px;
    background:url("../../assets/login-form.png") no-repeat center / cover;
    display: flex;
    border-radius: 20px;
    justify-content: flex-end;
    overflow: hidden;
    box-shadow: 0 0 15px 10px rgba(46, 92, 246, 0.2);;
  }

  .form {
    width: 450px;
    text-align: center;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .sys-name {
      font-weight: normal;
      font-size: 22px;
      white-space: nowrap;
      animation: logoAnimation 0.8s ease;

      .logo-img {
        width: 40px;
      }
    }
  }
}

@keyframes logoAnimation {
  0% {
    transform: scale(0);
  }

  80% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}

:deep(*) {
  .el-button {
    width: 100%;
    font-size: 16px;
    height: 45px;
  }

  .el-input__inner {
    --el-input-inner-height: 45px;
    font-size: 16px;
  }

  .el-icon {
    font-size: 16px;
  }
}
</style>
