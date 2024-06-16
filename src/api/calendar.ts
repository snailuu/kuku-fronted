import { http } from '@/utils/http'

enum Api {
    getWorkingSchedulePage = "/admin/workingSchedule/getWorkingSchedulePage"
}
export function getWorkingSchedulePage(data: any) {
    return http.post<any>(Api.getWorkingSchedulePage, data)
}