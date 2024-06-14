/**
 * useTable方法hooks
 * */
import {ElMessage, ElMessageBox} from "element-plus";
import {toSnakeCase} from "@/utils";
import {calcTableIndex} from "@/utils/util";

type tableType = {
    request: Function
    immediate?: boolean
    initParam?: Object
    searchParam?: Object
    isShowPage?: boolean
    dataCallBack?: Function
    afterCallback?: (data: any) => void
}

/**
 * @name useTable
 * @description 封装表格的hooks;
 * @param {Function} request 请求方法;
 * @param {Boolean} immediate 是否立即触发 (非必传，默认为true)
 * @param {Boolean} initParam 获取数据初始化参数(非必传，默认为{})
 * @param {Boolean} isShowPage 是否显示分页组件(非必传，默认为true);
 * @param {Function} dataCallBack 对后台返回的数据进行处理的方法(非必传)
 * @param {Function} afterCallback 获取数据后执行方法(非必传)
 * */
export function useTable({
                                     request,
                                     immediate = true,
                                     initParam = {},
                                     isShowPage = true,
                                     dataCallBack,
                                     afterCallback
                                 }: tableType) {
    const state = reactive({
        // 表格数据
        tableData: [],
        // 加载状态
        loading: false,
        //分页数据
        pagination: {
            pageIndex: 1,
            pageSize: 10,
            total: 0
        },
        // 查询参数
        searchParam: {},
        // 总参数(包含分页和查询参数)
        totalParam: {},
        // 排序参数
        sortParam: {},
        // 接口返回的所有内容
        responseData: null
    })

    // 获取表格数据
    async function getTableData() {
        updatedTotalParam();
        state.loading = true;
        const res = await request(state.totalParam);
        if (isShowPage) {
            state.tableData = res.list || [];
            state.pagination.total = res.total || 0;

            state.tableData = calcTableIndex(res,state.pagination);
        } else {
            state.tableData = res || []
        }
        try {
            dataCallBack && (state.tableData = dataCallBack(state.tableData));
        } catch (error) {
            console.error(error)
            ElMessage.error('格式化数据错误')
        } finally {
            state.loading = false;
        }
        afterCallback && afterCallback(state.tableData);
    }

    // 是否立即获取数据
    if (immediate) onBeforeMount(async () => {
        await getTableData()
    })

    // 处理查询参数
    const updatedTotalParam = () => {
        state.totalParam = {};
        Object.assign(state.totalParam, initParam, state.searchParam, isShowPage ? state.pagination : {}, state.sortParam);
    };

    // 查询
    const search = async (params: any) => {
        state.sortParam = {};
        state.pagination.pageIndex = 1;
        state.searchParam = params;
        updatedTotalParam();
        await getTableData();
    };

    // 排序
    const sortChange = async ({prop, order, key}: { prop: string, order: string, key: string }) => {
        state.sortParam = {
            orderByColumn: key || toSnakeCase(prop),
            orderByAsc: order === "ascending"
        };
        state.pagination.pageIndex = 1;
        updatedTotalParam();
        await getTableData();
    };

    // 翻页
    const changePage = async (page: number) => {
        state.pagination.pageIndex = page;
        updatedTotalParam();
        await getTableData()
    };
    // 修改每页显示数量
    const changeSize = async (size: number) => {
        state.pagination.pageIndex = 1;
        state.pagination.pageSize = size;
        updatedTotalParam();
        await getTableData()
    };

    return {
        ...toRefs(state),
        getTableData,
        changePage,
        search,
        sortChange,
        changeSize
    }
}


// 定义一个delTableType类型，它是一个对象
type delTableType = {
    // 对象属性id，它是一个字符串
    id: string
    // 对象属性request，它是一个函数，接受一个参数id，返回一个Promise<void>
    request: (id: string) => Promise<void>
    // 对象属性callback，它是一个函数，不返回任何值
    callback: () => void
}
// 删除表格数据
export function delTable({id, request, callback}: delTableType): void {
    // 弹出确认框，询问是否确认删除
    ElMessageBox.confirm(
        '是否确认删除本条数据？',
        '提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        })
        .then(() => {
            // 发送请求删除表格数据
            request(id).then(() => {
                // 删除成功，弹出提示框
                ElMessage.success('删除成功');
                // 如果有回调函数，则执行回调函数
                if (callback) callback();
            })
        }).catch(() => {
        // 取消删除，不执行任何操作
    })
}
