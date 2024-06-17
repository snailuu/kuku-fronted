# 1. build打包
npm run build

# 2. 在Dockerfile文件目录下，构建docker镜像，kuku-fronted为镜像名称
docker build -t kuku-fronted .

# 3. 将镜像导出为tar
docker save kuku-fronted3 -o kuku-fronted.tar


