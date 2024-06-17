import { http } from '@/utils/http'

enum Api {
    getServerInfo = "/admin/fast/getServerInfoAllTime",
    getDatainfo = "/data/getDataInfo"
}
export function getServerInfo() {
    return http.post<any>(Api.getServerInfo)
}
export function getDatainfo() {
    return http.post<any>(Api.getDatainfo)
}