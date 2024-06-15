import {http} from '@/utils/http'

// 添加人员排班表
export function addWorkingSchedule(data:any) {
    return http.post<any>('/admin/workingSchedule/addWorkingSchedule', data)
}

// 修改人员排班表
export function updateWorkingSchedule(data:any) {
    return http.post<any>('/admin/workingSchedule/updateWorkingSchedule', data)
}

// 删除人员排班表
export function deleteWorkingSchedule(id:string) {
    return http.post<any>('/admin/workingSchedule/deleteWorkingSchedule/'+id)
}

// 获取人员排班表详情
export function getWorkingSchedule(id:any) {
    return http.post<any>('/admin/workingSchedule/getWorkingSchedule/'+id)
}

// 获取人员排班表分页列表
export function getWorkingSchedulePage(data:any) {
    return http.post<any>('/admin/workingSchedule/getWorkingSchedulePage', data)
}





















