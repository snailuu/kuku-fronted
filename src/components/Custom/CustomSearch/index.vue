<template>
  <el-form :model="queryForm" label-width="90px">
    <el-row :gutter="20">
      <template v-for="item in configure">
        <!--        多选-->
        <el-col v-if="item.type==='checkBox'" :lg="8" :md="12" :sm="24" :xl="6">
          <el-form-item :label="item.label">
            <el-checkbox-group v-model="queryForm[item.prop]">
              <el-checkbox v-for="option in item.options" :label="option[item?.optionsConfig?.value||defaultConfig.value]" border >{{ option[item?.optionsConfig?.label || defaultConfig.label] }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
        <!--        单选-->
        <el-col v-else-if="item.type==='radio'" :lg="8" :md="12" :sm="24" :xl="6">
          <el-form-item :label="item.label">
            <el-radio-group v-model="queryForm[item.prop]">
              <el-radio v-for="option in item.options" :label="option[item.optionsConfig?.value||defaultConfig.value]"
                        border>
                {{ option[item.optionsConfig?.label || defaultConfig.label] }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!--        日期选择-->
        <el-col v-else-if="item.type==='date'" :lg="8" :md="12" :sm="24" :xl="6">
          <el-form-item :label="item.label">
            <el-date-picker
                v-model="queryForm[item.prop]"
                :placeholder="item.placeholder"
                value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
        <!--        日期范围选择-->
        <el-col v-else-if="item.type==='dateRange'" :lg="8" :md="12" :sm="24" :xl="6">
          <el-form-item :label="item.label">
            <custom-date-picker v-model:endDate="queryForm[item.endProp]" v-model:startDate="queryForm[item.startProp]"
                                type="daterange"/>
          </el-form-item>
        </el-col>
        <!--        下拉框-->
        <el-col v-else-if="item.type==='select'" :lg="8" :md="12" :sm="24" :xl="6">
          <el-form-item :label="item.label">
            <el-select v-model="queryForm[item.prop]" clearable :placeholder="item.placeholder" @change="()=>{item.change&&item.change(queryForm)}">
              <el-option v-for="option in item.options" :label="option[item.optionsConfig?.label||defaultConfig.label]"
                         :value="option[item.optionsConfig?.value||defaultConfig.value]"/>
            </el-select>
          </el-form-item>
        </el-col>
        <!--        级联-->
        <el-col v-else-if="item.type==='cascader'" :lg="8" :md="12" :sm="24" :xl="6">
          <el-form-item :label="item.label">
            <custom-tree-select v-model:value="queryForm[item.prop]" :options="item.options" :placeholder="item.placeholder"/>
          </el-form-item>
        </el-col>
        <!--        输入框-->
        <el-col v-else :lg="8" :md="12" :sm="24" :xl="6">
          <el-form-item :label="item.label">
            <el-input v-model="queryForm[item.prop]" clearable :placeholder="item.placeholder" @keyup.enter="onSearch"/>
          </el-form-item>
        </el-col>
      </template>
      <slot></slot>
      <el-col :lg="8" :md="12" :sm="24" :xl="6">
        <el-form-item label-width="0">
          <el-button type="primary" @click="onSearch">
            <el-icon>
              <ele-search/>
            </el-icon>
            <span class="search-btn__left">查询</span>
          </el-button>
          <el-button @click="onReset">
            <el-icon>
              <ele-refresh/>
            </el-icon>
            <span class="search-btn__left">重置</span>
          </el-button>
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>

<script lang="ts" setup>
type optionsConfigType={
  label:string
  value:string
}

// 定义一个optionsType类型
type optionsType={
  id:string|number,
  name:string
  children?:optionsType[]
}

// 定义一个configureType类型，用于配置输入框、下拉框、单选框、多选框、级联框、日期范围、日期等
type configureType={
  // 输入框类型，可以是input、select、radio、checkBox、cascader、dateRange、date
  type?:'input'|'select'|'radio'|'checkBox'|'cascader'|'dateRange'|'date',
  // 标签文本
  label:string
  // 属性名称
  prop?:string
  // 开始属性名称
  startProp?:string
  // 结束属性名称
  endProp?:string
  // 占位文本
  placeholder?:string
  // 选项配置
  optionsConfig?:optionsConfigType,
  // 选项
  options?:optionsType[],
  // 改变事件
  change?:any
}
const props = defineProps<{
  value?:any,
  configure:configureType[]
}>()

const emits = defineEmits<{
  (event: 'search', data: any): void
  (event: 'update:value', value: any): void
}>()

// 默认配置
const defaultConfig = {
  label: 'name',
  value: 'id'
}

/**
 * @description 查询
 * */
let queryForm = ref({})
// 查询
const onSearch = () => {
  emits('search',queryForm.value)
}
// 重置
const onReset = () => {
  queryForm.value = {}
  emits('search',queryForm.value)
}

watch(()=>props.value,()=>{
  if(props.value)queryForm.value={...queryForm.value,...props.value}
},{deep:true,immediate:true})

</script>

<style scoped>

</style>
