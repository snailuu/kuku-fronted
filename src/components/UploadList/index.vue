<template>
  <el-upload
      :before-upload="beforeUpload"
      :http-request="onUpload"
      :on-success="uploadSuccess"
      :file-list="upload.list"
      list-type="picture-card"
      class="uploader"
  >
    <template #default>
      <div class="uploader-default flex-center flex-column" :style="customStyle">
        <el-icon class="uploader-icon">
          <ele-upload-filled/>
        </el-icon>
        <div class="mt5">上传</div>
      </div>
    </template>
    <template #file="{ file }">
      <div class="w100 h100 flex-center">
        <el-icon v-if="file.status==='ready'" size="50" class="is-loading">
          <ele-loading />
        </el-icon>
<!--        <el-progress v-if="file.status==='ready'" type="circle" :percentage="90" :indeterminate="true"/>-->
        <video v-else-if="props.type==='video'" :poster="file.coverUrl" style="width: 100%;height: 100%"
               :src="file.url"></video>
        <img v-else class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
      </div>
      <div class="el-upload-list__item-actions flex-center">
        <span class="el-upload-list__item-preview" @click="onPreview(file)">
          <el-icon>
            <ele-zoom-in/>
          </el-icon>
        </span>
        <span v-if="!props.disabled" class="el-upload-list__item-delete" @click="onRemove(file)">
          <el-icon>
            <ele-delete/>
          </el-icon>
        </span>
      </div>
    </template>
  </el-upload>

  <!--    预览图片-->
  <el-image-viewer v-if="preview.isShowImg" @close="preview.isShowImg=false" :teleported="true"
                   :hide-on-click-modal="true" :url-list="[preview.url]"/>

  <!--    预览视频-->
  <el-dialog title="视频" v-if="preview.isShowVideo" append-to-body :model-value="true" width="800px"
             @close="preview.isShowVideo=false" :close-on-click-modal="false">
    <video style="width: 100%;height: 500px" :src="preview.url" controls></video>
  </el-dialog>
</template>

<script lang="ts" setup>
import type {UploadProps, UploadRequestOptions} from 'element-plus'
import {ElMessage} from 'element-plus'
import {uploadApi} from "@/api";

// 上传文件类型
const typeList: Record<string, any> = {
  any: {
    param: 'any',
    type: []
  },
  video: {
    param: 'any',
    type: ['mp4', 'webm', 'ogg']
  },
  image: {
    param: 'image',
    type: ['jpeg', 'jpg', 'png']
  },
  head: {
    param: 'head',
    type: ['jpeg', 'jpg', 'png']
  },
  word: {
    param: 'word',
    type: ['doc', 'docx']
  },
  excel: {
    param: 'excel',
    type: ['xls', 'xlsx']
  },
  pdf: {
    param: 'pdf',
    type: ['pdf']
  },
}

const props = withDefaults(defineProps<{
  value: any[],
  customStyle?: any,
  size?: number
  type?: string
  isCover?: boolean
}>(), {
  type: 'any',
  size: 5,
  customStyle: {}
})
const emits = defineEmits<{
  (event: 'update:value', val: any): void
  (event: 'change', url: string): void
}>()

const upload: any = reactive({
  list: computed({
    get: () => {
      return props.value
    },
    set: val => {
      emits('update:value', val);
    }
  })
})

// 上传之前
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  const extension = rawFile.name.split('.').pop() as string;
  if (props.type !== 'any' && typeList[props.type].type.indexOf(extension) == -1) {
    ElMessage.error('抱歉，文件格式不正确')
    return false;
  } else if (rawFile.size / 1024 / 1024 > props.size) {
    ElMessage.error(`抱歉，暂时不支持大于${props.size}M的文件上传`)
    return false;
  }
  return true;
}

// 上传
const onUpload = async (options: any) => {
  return uploadApi({
    file: options.file,
  }, {
    type: typeList[props.type].param,
    isCover: props.isCover,
    onUploadProgress: (progressEvent: any) => {
      let progress = parseInt('' + (progressEvent.loaded / progressEvent.total) * 100);
      if (progress > 90) progress = 90;
    }
  }).catch(() => {
  })
}

// 上传成功
const uploadSuccess: UploadProps['onSuccess'] = (
    response, file: any, fileList: any
) => {
  upload.list = fileList.map((p: any) => {
    if (p.uid == file.uid) {
      p.isProgress = false;
    }
    return p;
  })
  let list = upload.list;
  list.push(response);
  upload.list = [...list];
  emits('change', response);
}


const preview = reactive({
  url: '',
  isShowImg: false,
  isShowVideo: false,
})
// 预览
const onPreview = (file: { url:string}) => {
  preview.url = file.url;
  if (props.type === 'image') {
    preview.isShowImg = true;
  } else if (props.type === 'video') {
    preview.isShowVideo = true;
  }
}

// 删除
const onRemove = (file: any) => {
  const index = upload.list.findIndex((item:{url:string}) => item.url == file.url);
  upload.list.splice(index, 1);
}
</script>

<style lang="scss" scoped>

.uploader {
  width: 100%;

  .el-upload {
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    border-radius: 6px !important;

    &:hover {
      border-color: var(--el-color-primary);
    }
  }

  .progress {
    position: absolute;
    z-index: 50;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .uploader-img {
    width: 150px;
    height: 150px;
    display: block;
  }

  .uploader-default {
    color: #8c939d;
    width: 150px;
    height: 150px;
    font-size: 14px;

    .uploader-icon {
      font-size: 40px;
    }
  }

}


</style>
