<template>
  <div>
    <!-- <el-button type="primary">首页</el-button> -->
    <div class="content">
      <div class="on">
        <el-card class="upCard">
          <div class="title">
            <h1>用户数量</h1>
            <img style="width: 40px;height: 40px;" src="../../assets/img/blue1.png" />
          </div>
          <div class="details">
            <h1>{{ sumUser }}</h1>
            <img style="width: 150px;height: 45px;" src="../../assets/img/blue2.png" />
          </div>
        </el-card>
        <el-card class="upCard">
          <div class="title">
            <h1>总工单数量</h1>
            <img style="width: 40px;height: 40px; " src="../../assets/img/red1.png" />
          </div>
          <div class="details">
            <h1>{{ sumTicket }}</h1>
            <img style="width: 150px;height: 45px;" src="../../assets/img/red2.png" />
          </div>
        </el-card>
        <el-card class="upCard">
          <div class="title">
            <h1>待完成工单数量</h1>
            <img style="width: 40px;height: 40px; " src="../../assets/img/green1.png" />
          </div>
          <div class="details">
            <h1>{{ sumUnReady }}</h1>
            <img style="width: 150px;height: 45px;" src="../../assets/img/green2.png" />
          </div>
        </el-card>
      </div>
      <div class="under">
        <el-card class="unCard">
          <div style="height: 95%; width: 100%;" id="category"></div>
          <h3 style="margin-left: 400px;">工单完成情况</h3>
        </el-card>
        <el-card>
          <template class="serverInfo">
            <div class="item">
              <div class="icon">
                <img src="../../assets/ico/闪电.svg">
              </div>
              <div class="name">内存使用</div>
              <div class="data" id="data-server"></div>
            </div>
            <div class="item">
              <div class="icon">
                <img src="../../assets/ico/上下.svg">
              </div>
              <div class="name">JVM使用</div>
              <div class="data" id="data-jvm"></div>
            </div>
            <div class="item">
              <div class="icon">
                <img src="../../assets/ico/水滴.svg">
              </div>
              <div class="name">磁盘使用</div>
              <div class="data" id="data-disk"></div>
            </div>
            <div style="height: 200px;width: 100%; margin-top: 5px;">
              <div id="main" style="width: auto; height: 100%;"></div>
            </div>
          </template>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import { getServerInfo, getDatainfo } from '@/api/home'
import * as echarts from 'echarts';

const chartsLineWidth = 10
const server_data = ref([]);
const jvm_data = ref([]);
const disk_data = ref([])
let chart_server = undefined;
let chart_jvm = undefined;
let chart_disk = undefined;
const get_echarts_datas_sever = () => {
  var dom = document.getElementById("data-server");
  chart_server = echarts.init(dom);
  var option;
  option = {
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: chartsLineWidth,
          roundCap: {
            show: true
          },
          itemStyle: {
            color: '#4ABDAC',
          }
        },
        splitNumber: -1,
        axisLine: {
          lineStyle: {
            width: chartsLineWidth
          },
          roundCap: {
            show: true
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 10,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          show: false,
          distance: 15,
          color: '#FF0000',
          fontSize: 10
        },
        anchor: {
          show: false,
          showAbove: false,
          size: 10,
          itemStyle: {
            borderWidth: 10
          }
        },
        pointer: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: false,
          fontSize: 15,
          offsetCenter: [0, 0],
          formatter: '{value} %',
        },
        data: server_data.value
      }
    ]
  };
  chart_server.setOption(option);
}

const get_echarts_datas_jvm = () => {
  var dom = document.getElementById("data-jvm");
  chart_jvm = echarts.init(dom);
  var option;
  option = {
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: chartsLineWidth,
          roundCap: {
            show: true
          },
          itemStyle: {
            color: '#FF7E86',
          }
        },
        splitNumber: -1,
        axisLine: {
          lineStyle: {
            width: chartsLineWidth
          },
          roundCap: {
            show: true
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 10,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          show: false,
          distance: 15,
          color: '#FF0000',
          fontSize: 10
        },
        anchor: {
          show: false,
          showAbove: false,
          size: 10,
          itemStyle: {
            borderWidth: 10
          }
        },
        pointer: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: false,
          fontSize: 15,
          offsetCenter: [0, 0],
          formatter: '{value} %',
        },
        data: jvm_data.value
      }
    ]
  };
  chart_jvm.setOption(option);
}

const get_echarts_datas_disk = () => {
  var dom = document.getElementById("data-disk");
  chart_disk = echarts.init(dom);
  var option;
  option = {
    series: [
      {
        type: 'gauge',
        progress: {
          show: true,
          width: chartsLineWidth,
          roundCap: {
            show: true
          },
          itemStyle: {
            color: '#A162F7',
          }
        },
        splitNumber: -1,
        axisLine: {
          lineStyle: {
            width: chartsLineWidth
          },
          roundCap: {
            show: true
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          length: 10,
          lineStyle: {
            width: 2,
            color: '#999'
          }
        },
        axisLabel: {
          show: false,
          distance: 15,
          color: '#FF0000',
          fontSize: 10
        },
        anchor: {
          show: false,
          showAbove: false,
          size: 10,
          itemStyle: {
            borderWidth: 10
          }
        },
        pointer: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          valueAnimation: false,
          fontSize: 15,
          offsetCenter: [0, 0],
          formatter: '{value} %',
        },
        data: disk_data.value
      }
    ]
  };
  chart_disk.setOption(option);
}

const work_data = ref([])
let chart_work = undefined;
const get_echarts_datas_work = () => {
  var dom = document.getElementById("category")
  chart_work = echarts.init(dom);
  var option;
  option = {
    legend: {},
    tooltip: {},
    dataset: {
      source: basicData.value
    },
    xAxis: { type: 'category' },
    yAxis: {},
    series: [
      {
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          borderRadius: [20, 20, 0, 0], // 设置柱子顶部的圆弧效果，数组数值分别为左上角、右上角、右下角、左下角的圆角半径
          color: '#FF6347', // 设置柱子的颜色
        },
        barCategoryGap: '20%', // 设置柱子之间的间距
      },
      {
        type: 'bar',
        barWidth: 10,
        itemStyle: {
          borderRadius: [8, 8, 0, 0], // 设置柱子顶部的圆弧效果，数组数值分别为左上角、右上角、右下角、左下角的圆角半径
          color: '#1E90FF', // 设置柱子的颜色
        },
        barCategoryGap: '20%', // 设置柱子之间的间距
      }
    ]
  };
  chart_work.setOption(option);
}

const cpuData = ref([
  { value: 0, name: '核心数' },
  { value: 0, name: '总使用率' },
  { value: 0, name: '系统使用率' },
  { value: 0, name: '用户使用率' },
  { value: 0, name: '当前空闲率' },
]);
const myChart = ref(null);
//饼图
const options = reactive({
  title: {
    text: 'CPU运行情况',
    left: 'center',
    top: 'center',
    textStyle: {
      fontSize: 12, // 设置标题文字大小为16像素
    },
  },
  series: [
    {
      type: 'pie',
      data: cpuData.value,
      radius: ['40%', '80%'], // 调整半径以提供更好的标签空间
    }
  ]
});


//获取所有设备运行数据
const getServerData = async () => {
  // 基于准备好的dom，初始化echarts实例
  myChart.value = echarts.init(document.getElementById('main')!);
  try {
    const res = await getServerInfo()
    console.log("设备数据：", res);
    cpuData.value[0].value = res.cpu.cpuNum;
    cpuData.value[1].value = res.cpu.used;
    cpuData.value[2].value = res.cpu.sys;
    cpuData.value[3].value = res.cpu.user;
    cpuData.value[4].value = res.cpu.free;
    console.log(cpuData.value);
    server_data.value[0] = parseInt(res.memory);
    console.log('已使用内存：', server_data.value[0]);
    jvm_data.value[0] = parseInt(res.jvm);
    console.log('已使用jvm：', jvm_data.value[0]);
    disk_data.value[0] = parseInt(res.disk);
    console.log('已使用磁盘：', disk_data.value[0]);
    //绘制图表
    if (myChart.value) {
      myChart.value.setOption(options);
      get_echarts_datas_sever()
      get_echarts_datas_jvm()
      get_echarts_datas_disk()
    }
    setTimeout(getServerData, 2000)


  } catch (e) {
    console.log("获取设备数据错误：", e);

  }
}
const basicData = ref([[]])
const sumUser = ref(0)
const sumTicket = ref(0)
const sumUnReady = ref(0)
const getData = async () => {
  try {
    const res = await getDatainfo()
    sumUser.value = res.totalUser;
    sumTicket.value = res.totalTicket;
    sumUnReady.value = res.totalReadyTicket;
    console.log("基本数据：", res);
    let tmp = ["product", '未完成', '已完成']
    basicData.value = [tmp].concat(Array.from(res.recentTicket).map(item => {
      return [item.date.slice(6), item.finish, item.unFinish]
    }))
    get_echarts_datas_work()
  } catch (e) {
    console.log("获取数据错误：", e);

  }
}


onMounted(() => {
  getServerData();
  getData()

});
</script>
<style scoped>
.on {
  display: flex;
  justify-content: space-between;
  width: 1300px;
  height: 250px;
  /* border: 1px solid red; */
  margin: 10px;
}

.on .upCard {
  width: 420px;
  height: 250px;

}

.on .upCard .title {
  width: 100%;
  height: 20%;
  /* border: 1px solid blue; */
  display: flex;
  justify-content: space-between;
}

.on .upCard .details {
  width: 100%;
  height: 70%;
  /* border: 1px solid blue; */
  display: flex;
  margin: 15px auto;
  justify-content: space-between;
}

.title h1 {
  margin-left: 15px;
  line-height: 50px;
}

.title img {
  margin-top: 10px;
  margin-right: 20px;
}

.details h1 {
  margin-left: 15px;
  margin-top: 55px;
}

.details img {
  margin-right: 30px;
  margin-top: 45px;
}

.under {
  display: flex;
  justify-content: space-between;
  width: 1300px;
  height: 360px;
  /* border: 1px solid red; */
  margin: 0 10px;
}

.under .unCard {
  height: 100%;
  width: 68%;
}

.under .serverInfo {
  height: 100%;
  width: 390px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}



.content {}

.item {
  height: 140px;
  display: grid;
  grid-template-rows: 1fr 1fr 2fr;
  justify-content: center;
  grid-gap: 0px 0px;
  box-sizing: border-box;
  border-radius: 5px;
  padding-top: 8px;
  width: 120px;
  background-color: #fff;
  border: 1px solid #CECECE;
}

.data {
  width: 120px;
  height: 100px;
}

.icon,
.name {
  display: flex;
  justify-content: center;
}

.icon img {
  width: 30px;
}

.name {
  font-family: Source Han Sans CN;
  font-size: 10px;
  font-weight: bold;
  letter-spacing: 0em;

  color: #3D3D3D;
}
</style>