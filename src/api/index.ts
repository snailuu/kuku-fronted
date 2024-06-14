import {http} from '@/utils/http'
import {UploadParamsTypes} from "@/api/types/uploadTypes";

enum Api {
    upload = '/common/upload/',
}

/** 单个文件上传*/
export function uploadApi(data:UploadParamsTypes) {
    return http.post<any>(Api.upload, data,{
        headers:{
            'Content-Type':'multipart/form-data'
        }
    })
}

