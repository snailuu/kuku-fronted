# 以下在服务器上操作
# 1. 停止容器
docker stop spring-boot-plus-vue3-container
# 2. 删除容器
docker rm spring-boot-plus-vue3-container
# 3. 删除镜像
docker rmi spring-boot-plus-vue3
# 4. 加载镜像
docker load -i spring-boot-plus-vue3.tar
# 5. 直接运行
docker run -p 8889:80 -d  --name spring-boot-plus-vue3-container spring-boot-plus-vue3
# 6. 查看运行情况
docker ps -a -f name=spring-boot-plus-vue3-container
# 7. 查看指定名称的镜像
docker images spring-boot-plus-vue3
# 8. 访问项目，本地运行docker可以用localhost访问，服务器运行docker需将localhost该成docker物理机ip
# 访问前端页面
# http://localhost:8889



