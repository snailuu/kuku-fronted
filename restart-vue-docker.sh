# 以下在服务器上操作
# 1. 停止容器
docker stop kuku-fronted-container
# 2. 删除容器
docker rm kuku-fronted-container
# 3. 删除镜像
docker rmi kuku-fronted
# 4. 加载镜像
docker load -i kuku-fronted.tar
# 5. 直接运行
docker run -p 8889:80 -d  --name kuku-fronted-container kuku-fronted
# 6. 查看运行情况
docker ps -a -f name=kuku-fronted-container
# 7. 查看指定名称的镜像
docker images kuku-fronted
# 8. 访问项目，本地运行docker可以用localhost访问，服务器运行docker需将localhost该成docker物理机ip
# 访问前端页面
# http://localhost:8889



