/**
 * 生成代码
 * */
import {http} from '@/utils/http'

enum Api {
    getDbTablePage = '/admin/generator/getDbTablePage',
    generatorCode = '/admin/generator/generatorCode',
    downloadCode = '/admin/generator/downloadCode',
    updateGeneratorTable = '/admin/generator/updateGeneratorTable',
    getGeneratorTable = '/admin/generator/getGeneratorTable/',
    previewCode = '/admin/generator/previewCode/',
}

/** 生成代码*/
// 获取数据库表
export function getDbTablePageApi(data:any) {
    return http.post<any>(Api.getDbTablePage, data)
}
// 生成代码
export function generatorCodeApi(data:any) {
    return http.post<any>(Api.generatorCode, data)
}
// 下载代码
export function downloadCodeAPi(data:any) {
    return http.post<any>(Api.downloadCode,data,{
        responseType:'blob'
    })
}
// 修改生成代码表
export function updateGeneratorTableApi(data:any) {
    return http.post<any>(Api.updateGeneratorTable, data)
}
// 生成代码表详情
export function getGeneratorTableApi(tableName:string) {
    return http.post<any>(Api.getGeneratorTable+tableName)
}
// 预览代码
export function previewCodeApi(tableName:any) {
    return http.post<any>(Api.previewCode+tableName)
}















