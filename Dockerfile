FROM nginx
ADD dist/ /usr/share/nginx/html/
ADD nginx.cnf /etc/nginx/conf.d/nginx.cnf
