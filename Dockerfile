
FROM httpd:latest

SHELL ["/bin/bash", "-c"]

RUN sed -i \
		-e 's/^#\(Include .*httpd-ssl.conf\)/\1/' \
		-e 's/^#\(LoadModule .*mod_ssl.so\)/\1/' \
		-e 's/^#\(LoadModule .*mod_socache_shmcb.so\)/\1/' \
		/usr/local/apache2/conf/httpd.conf

COPY ./studi-public.crt /usr/local/apache2/conf/server.crt
COPY ./studi-private.key /usr/local/apache2/conf/server.key
COPY ./httpd-ssl.conf /usr/local/apache2/conf/extra/httpd-ssl.conf

RUN apt-get install -y ca-certificates
COPY ./studi-cacert.crt /usr/local/share/ca-certificates
RUN update-ca-certificates

RUN mkdir -p /usr/local/apache2/html/ecf-garage-front

COPY ./dist/ecf-garage-front /usr/local/apache2/html/ecf-garage-front
