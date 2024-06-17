<template>
  <div class="container">
    <div class="form-box">
      <div class="form">
        <div class="sys-name mb30 flex-center">
          <img class="logo-img mr5" src="@/assets/logo.png" alt="">

          <p id="kuku-title"></p>
        </div>
<!--        <h1 class="animate__animated animate__bounce">An animated element</h1>-->
        <transition name="fade" mode="out-in">
          <template v-if="isLogin">
            <el-form animate__animated animate__flash ref="ruleFormRef" :model="loginForm" :rules="loginRules">
              <el-form-item  v-if="isLogin" class="mb25" prop="username">
                <el-input style="width: 300px" :prefix-icon="User" clearable v-model="loginForm.username"
                          placeholder="请输入用户名"/>
              </el-form-item>
              <el-form-item v-if="isLogin" class="mb25" prop="password">
                <el-input :prefix-icon="Lock" show-password clearable v-model="loginForm.password"
                          placeholder="请输入密码"/>
              </el-form-item>
              <div class="button-group">
                <el-button v-if="isLogin" size="large" type="primary" round @click="login">登录</el-button>
                <el-button v-else size="large" type="primary" round @click="register">注册</el-button>
              </div>
              <div class="switch-link">
                <span @click="toggleForm">{{ isLogin ? '没有账号？注册' : '已有账号？登录' }}</span>
              </div>
            </el-form>
          </template>
          <template v-else>
            <el-form animate__animated animate__flash ref="ruleFormRef" :model="registerForm" :rules="registerRules">
              <el-form-item class="mb25" prop="username">
                <el-input style="width: 300px" :prefix-icon="User" clearable v-model="registerForm.username"
                          placeholder="请输入用户名"/>
              </el-form-item>
              <el-form-item class="mb25" prop="password">
                <el-input :prefix-icon="Lock" show-password clearable v-model="registerForm.password"
                          placeholder="请输入密码"/>
              </el-form-item>
              <el-form-item class="mb25" prop="confirmPassword">
                <el-input :prefix-icon="Lock" show-password clearable v-model="registerForm.confirmPassword"
                          placeholder="请确认密码"/>
              </el-form-item>
              <el-form-item class="mb25" prop="email">
                <el-input :prefix-icon="Lock"  clearable v-model="registerForm.email"
                          placeholder="请输入邮箱(仅支持163和qq邮箱)"/>

              </el-form-item>
              <div class="button-group">
                <el-button v-if="isLogin" size="large" type="primary" round @click="login">登录</el-button>
                <el-button v-else size="large" type="primary" round @click="register">注册</el-button>
              </div>
              <div class="switch-link">
                <span @click="toggleForm">{{ isLogin ? '没有账号？注册' : '已有账号？登录' }}</span>
              </div>
            </el-form>
          </template>
        </transition>

      </div>
    </div>
  </div>
</template>


<script lang="ts" setup>
import {ref, reactive, onMounted} from 'vue';
import {useUserStoreHook} from "@/store/modules/user";
import {Lock, User} from "@element-plus/icons-vue";
import md5 from "js-md5";
import {NextLoading} from "@/utils/loading";
import TypeIt from "typeit";
import {ElMessage} from "element-plus";

const router = useRouter();

const isLogin = ref(true); // 是否是登录表单
const regex = {
  email : /^([A-Za-z0-9_\-\.])+\@(163.com|qq.com|42du.cn)$/,
}

const loginForm = reactive({
  username: '',
  password: ''
})

const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email:''
})

const ruleForm = reactive({
  username: '',
  password: '',
  confirmPassword: ''
});

const loginRules = reactive({
  username: [{
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  }]
});

const registerRules = reactive({
  username: [{
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  }],
  confirmPassword: [{
    required: true,
    message: '请确认密码',
    trigger: 'blur',
  }],
  email: [{
    required: true,
    message: '请输入邮箱',
    trigger: 'blur',
  }]
});

const toggleForm = () => {
  isLogin.value = !isLogin.value;
  loginForm.username = '';
  loginForm.password = '';
  registerForm.username = '';
  registerForm.password = '';
  registerForm.confirmPassword = '';
  registerForm.email = '';
};

const login = () => {
  useUserStoreHook().login({
    username: loginForm.username,
    password: md5(loginForm.password)
  }).then(async () => {
    NextLoading.start();
    await router.push('/');
  });
};

const register = () => {
  if(registerForm.password == null || registerForm.password == ""){
    ElMessage.error('密码不能为空');
    return;
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    ElMessage.error('密码和确认密码不一致');
    return;
  }
  if(!regex.email.test(registerForm.email)){
    ElMessage.error('邮箱格式不正确,仅支持163和qq邮箱');
    return;
  }
  // 注册逻辑（这里需要根据具体情况实现）
  useUserStoreHook().register({
    username: registerForm.username,
    password: md5(registerForm.password),
    email: registerForm.email
  }).then(async ()=>{
    toggleForm();
  })

};

onMounted(() => {
  NextLoading.done();
  // new TypeIt("#kuku-title", {
  //   strings: "kuku工单报修管理后台",
  //   waitUntilVisible: true,
  // }).go();
  new TypeIt("#kuku-title", {
    strings: "kuku工单报修管理后台",
    waitUntilVisible: true,
    cursor: false, // 设置光标不显示
    speed: 150,

  }).go();
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

  .form-box {
    width: 1150px;
    margin: auto;
    height: 600px;
    background: url("../../assets/login-form.png") no-repeat center / cover;
    display: flex;
    border-radius: 20px;
    justify-content: flex-end;
    overflow: hidden;
    box-shadow: 0 0 15px 10px rgba(46, 92, 246, 0.2);
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

.button-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;

  .el-button {
    font-size: 16px;
    height: 45px;
  }
}

.switch-link {
  margin-top: 20px;
  cursor: pointer;
  color: #409eff;

  span:hover {
    text-decoration: underline;
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
