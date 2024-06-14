/**
 * demo 测试商品
 * */
import {http} from '@/utils/http'

enum Api {
    updateDemoProduct = '/admin/demoProduct/updateDemoProduct',
    getDemoProductPage = '/admin/demoProduct/getDemoProductPage',
    getDemoProduct = '/admin/demoProduct/getDemoProduct/',
    deleteDemoProduct = '/admin/demoProduct/deleteDemoProduct/',
    addDemoProduct = '/admin/demoProduct/addDemoProduct',
}

/** 测试商品*/
// 修改测试商品
export function updateDemoProductApi(data: any) {
    return http.post<any>(Api.updateDemoProduct, data)
}

// 测试商品分页列表
export function getDemoProductPageApi(data: any) {
    return http.post<any>(Api.getDemoProductPage, data)
}

// 测试商品详情
export function getDemoProductAPi(id: any) {
    return http.post<any>(Api.getDemoProduct + id)
}

// 删除测试商品
export function deleteDemoProductApi(id: string) {
    return http.post<any>(Api.deleteDemoProduct + id)
}

// 添加测试商品
export function addDemoProductApi(data: any) {
    return http.post<any>(Api.addDemoProduct, data)
}















