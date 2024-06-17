<template>
  <el-card class="mb-4 box-card" shadow="never">
      <span>
        kuku工单报修系统的介绍信息
      </span>
  </el-card>
  <el-card class="m-4 box-card" shadow="never">
    <template #header>
      <div class="card-header">
        <span class="font-medium">平台信息</span>
      </div>
    </template>
    <el-descriptions
        title="项目信息"
        direction="vertical"
        :column="4"
        border
    >
      <el-descriptions-item label="名称">{{infoList.data['projectInfo']?.name}}</el-descriptions-item>
      <el-descriptions-item label="端口">{{ infoList.data['projectInfo']?.port }}</el-descriptions-item>
      <el-descriptions-item label="路径">{{ infoList.data['projectInfo']?.contextPath }}</el-descriptions-item>
      <el-descriptions-item label="当前环境">{{ infoList.data['projectInfo']?.active }}</el-descriptions-item>
      <el-descriptions-item label="运行目录">{{ infoList.data['projectInfo']?.userDir }}</el-descriptions-item>

    </el-descriptions>
      <el-descriptions
          title="操作系统信息"
          direction="vertical"
          :column="3"
          border
      >
        <el-descriptions-item label="操作系统">{{infoList.data['operatingSystemInfo']?.name}}</el-descriptions-item>
        <el-descriptions-item label="架构">{{ infoList.data['operatingSystemInfo']?.arch }}</el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ infoList.data['operatingSystemInfo']?.address }}</el-descriptions-item>

      </el-descriptions>
    <el-descriptions
        title="磁盘使用情况"
        direction="vertical"
        :column="4"
        border
        v-if="infoList.data['diskList']?.length"
    >

      <template v-for="(item, index) in infoList.data['diskList']" :key="item">
        <el-descriptions-item label="磁盘名称">{{item.name}}</el-descriptions-item>
        <el-descriptions-item label="文件系统类型">{{ item.type }}</el-descriptions-item>
        <el-descriptions-item label="磁盘总空间大小">{{ item.totalSpaceUnit }}</el-descriptions-item>
        <el-descriptions-item label="磁盘剩余空间大小">
          <el-tag >{{ item.usableSpaceUnit }}</el-tag>
        </el-descriptions-item>
      </template>

    </el-descriptions>
  </el-card>
</template>
<script setup lang="ts">

import {getServerInfoApi} from "@/api/system";

const infoLoading = ref({
  status: false
})
const infoList = reactive({
  data:[]
})

const getServerInfo = () => {
  getServerInfoApi().then(res => {
    infoList.data = res;
    console.log(res)
  })

}
getServerInfo();


</script>
<style scoped>
.box-card{
  margin: 20px;
}
.el-descriptions:not(:first-child){
  margin-top: 20px;
}
</style>
