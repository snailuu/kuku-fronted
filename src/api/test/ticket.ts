import {http} from '@/utils/http'

// 添加工单
export function addTicket(data:any) {
    return http.post<any>('/admin/ticket/addTicket', data)
}

// 修改工单
export function updateTicket(data:any) {
    return http.post<any>('/admin/ticket/updateTicket', data)
}

// 删除工单
export function deleteTicket(id:string) {
    return http.post<any>('/admin/ticket/deleteTicket/'+id)
}

// 获取工单详情
export function getTicket(id:any) {
    return http.post<any>('/admin/ticket/getTicket/'+id)
}

// 获取工单分页列表
export function getTicketPage(data:any) {
    return http.post<any>('/admin/ticket/getTicketPage', data)
}





















