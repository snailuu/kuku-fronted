<template>
  <slot v-if="getUserAuthBtnList"/>
</template>

<script setup lang="ts">
import {useUserStore} from '@/store/modules/user';

// 定义父组件传过来的值
const props = defineProps({
  value: {
    type: String,
    default: () => '',
  },
});

const {userinfo} = useUserStore();

// 获取用户权限
const getUserAuthBtnList = computed(() => {
  if(userinfo.admin){
    return true;
  }
  return userinfo.permissions.some((v: string) => v === props.value);
});
</script>
