# 1. build打包
npm run build

# 2. 在Dockerfile文件目录下，构建docker镜像，spring-boot-plus-vue3为镜像名称
docker build -t spring-boot-plus-vue3 .

# 3. 将镜像导出为tar
docker save spring-boot-plus-vue3 -o spring-boot-plus-vue3.tar


