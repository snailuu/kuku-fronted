import {http} from '@/utils/http'

// 添加值班安排
export function addArrange(data:any) {
    return http.post<any>('/admin/arrange/addArrange', data)
}

// 修改值班安排
export function updateArrange(data:any) {
    return http.post<any>('/admin/arrange/updateArrange', data)
}

// 删除值班安排
export function deleteArrange(id:string) {
    return http.post<any>('/admin/arrange/deleteArrange/'+id)
}

// 获取值班安排详情
export function getArrange(id:any) {
    return http.post<any>('/admin/arrange/getArrange/'+id)
}

// 获取值班安排分页列表
export function getArrangePage(data:any) {
    return http.post<any>('/admin/arrange/getArrangePage', data)
}





















