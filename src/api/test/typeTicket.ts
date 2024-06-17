import {http} from '@/utils/http'

// 添加工单类型表
export function addTypeTicket(data:any) {
    return http.post<any>('/admin/typeTicket/addTypeTicket', data)
}

// 修改工单类型表
export function updateTypeTicket(data:any) {
    return http.post<any>('/admin/typeTicket/updateTypeTicket', data)
}

// 删除工单类型表
export function deleteTypeTicket(id:string) {
    return http.post<any>('/admin/typeTicket/deleteTypeTicket/'+id)
}

// 获取工单类型表详情
export function getTypeTicket(id:any) {
    return http.post<any>('/admin/typeTicket/getTypeTicket/'+id)
}

// 获取工单类型表分页列表
export function getTypeTicketPage(data:any) {
    return http.post<any>('/admin/typeTicket/getTypeTicketPage', data)
}





















