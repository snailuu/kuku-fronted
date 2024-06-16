<template>
    <el-calendar>
        <template #date-cell="{ data }">
            <div @click="handleDateClick(data)">
                <p :class="data.isSelected ? 'is-selected' : ''">
                    {{ data.day.split('-').slice(1).join('-') }}
                </p>
                <div style="height: 10px"></div>
                <!-- <template v-for="item in dynamicData" :key="item.workingDate"> -->
                <el-tag v-if="isDateInDynamicData(data.day)" type="success"> 已排</el-tag>
                <!-- </template> -->
                <el-tag v-if="!isDateInDynamicData(data.day)" :type="tagType">{{ tag }}</el-tag>
            </div>
        </template>
    </el-calendar>

    <el-dialog :title="selectDate + ' 值班详情 :'" v-model="dialogVisible" width="80%" @close="dialogVisible = false">
        <div class="dialo">
            <!-- <span>{{ dialogContent }}</span>
            <template v-for="item in dynamicData" :key="item.workingDate">
                <el-tag v-if="item.status === '1' && item.workingDate === selectDate" type="primary">{{
                    working_status_one
                }}</el-tag>
                <el-tag v-if="item.status === '2' && item.workingDate === selectDate" type="info">{{ working_status_two
                    }}</el-tag>
                <el-tag v-if="item.status === '3' && item.workingDate === selectDate" type="success">{{
                    working_status_three
                }}</el-tag>
                <el-tag v-if="item.status === '4' && item.workingDate === selectDate" type="danger">{{
                    working_status_four
                }}</el-tag>
            </template> -->
            <el-table :data="filteredData" style="width: 100%">
                <el-table-column prop="nickname" label="值班人员" align="center" show-overflow-tooltip />
                <el-table-column prop="arrangeType" label="值班安排" align="center">
                    <template #default="scope">
                        <el-tag v-if="scope.row.arrangeType == 1" type="warning">早班</el-tag>
                        <el-tag v-else-if="scope.row.arrangeType == 2">午班</el-tag>
                        <el-tag v-else-if="scope.row.arrangeType == 3" type="success">晚班</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="status" label="值班状态" align="center">
                    <template #default="scope">
                        <el-tag v-if="scope.row.status == 1" type="info">计划中</el-tag>
                        <el-tag v-else-if="scope.row.status == 2">进行中</el-tag>
                        <el-tag v-else-if="scope.row.status == 3" type="success">已完成</el-tag>
                        <el-tag v-else-if="scope.row.status == 4" type="warning">缺勤</el-tag>
                        <el-tag v-else type="info">未知状态</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { defineProps } from 'vue';
import { getWorkingSchedulePage } from '@/api/calendar';

const props = defineProps();
const dialogVisible = ref(false);
const dialogContent = ref('');
const tagType = ref('info');
const tag = ref('未排');
const working_status_one = ref('');
const working_status_two = ref('');
const working_status_three = ref('');
const working_status_four = ref('');
const arrange_type = ref('');
const selectDate = ref('');

const postParam = ref({
    "orderByColumn": "",
    "orderByAsc": true,
    "pageIndex": 1,
    "pageSize": 10,
    "keyword": "",
    "arrangeType": "",
    "workingDateStart": "",
    "workingDateEnd": "",
    "status": ""

})
const dynamicData = reactive([{
    workingDate: "",
    nickname: "",
    status: "",
    arrangeType: ""
}]);
//过滤排班数据，一对一
const filteredData = computed(() => {
    return dynamicData.filter((item: any) => {
        return item.workingDate === selectDate.value
    });
});
const setStatus = () => {
    console.log("设置状态");
    dynamicData.forEach((item: any) => {
        switch (item.status) {
            case "1":
                working_status_one.value = '计划中';
                break;
            case "2":
                working_status_two.value = '进行中';
                break;
            case "3":
                working_status_three.value = '已打卡';
                break;
            case "4":
                working_status_four.value = '缺勤';
                break;
            default:

                break;
        }
    });
}

//判断当前日期在返回的数据里是否包含
const isDateInDynamicData = (date: string) => {
    return dynamicData.some((item: any) => item.workingDate === date);
};
//点击打开弹窗判断是否有排班数据
const handleDateClick = (data: { day: string }) => {
    console.log(dynamicData);
    const selectedItem = dynamicData.find((item: { workingDate: string; }) => item.workingDate === data.day);
    console.log(data);

    console.log(data.day, selectedItem);
    if (selectedItem) {
        selectDate.value = data.day;
        dialogContent.value = selectedItem.nickname;
        dialogVisible.value = true;
    } else {
        nextTick(() => {
            ElMessage.error(`${data.day}未查询到排班信息.`);
        });
        console.log("无数据");
    }
    setStatus()
};
const getData = async (postParam: any) => {
    try {
        const res = await getWorkingSchedulePage({ ...postParam.value });

        dynamicData.length = 0;

        res.list.forEach((item: any) => {
            const dateOnly = item.workingDate.split(" ")[0];
            dynamicData.push({
                workingDate: dateOnly,
                nickname: item.nickname,
                status: item.status,
                arrangeType: item.arrangeType
            });
        });
        console.log("数据已更新:", dynamicData);

    } catch (error) {
        console.error("获取数据时出错:", error);
    }
}
onMounted(() => {
    getData(postParam);
    console.log('过滤数据：', filteredData);

})
</script>

<style scoped>
.is-selected {
    font-weight: bold;
}
</style>