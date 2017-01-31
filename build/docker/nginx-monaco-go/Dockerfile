FROM mohamedbana/monaco-go:145a117

RUN apt-get install -qq -y  \
  supervisor \
  openssh-server
RUN mkdir -p \
  /var/run/sshd \
  /var/log/supervisor \
  /var/log/monaco-go

# >>>>>>>>>>>>
# https://docs.docker.com/engine/examples/running_ssh_service/
# http://www.tothenew.com/blog/dockerizing-nginx-and-ssh-using-supervisord/
RUN echo 'root:password' | chpasswd
RUN sed -i 's/PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config

# SSH login fix. Otherwise user is kicked off after login
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd
ENV NOTVISIBLE "in users profile"
RUN echo "export VISIBLE=now" >> /etc/profile
# <<<<<<<<<<<<

# >>>>>>>>>>>>
# nginx
RUN \
  apt-get update -qq -y && \
  apt-get upgrade -qq -y

RUN apt-get install -qq -y \
  nginx
# <<<<<<<<<<<<

# >>>>>>>>>>>>
# Expose ports
ENV LANGSERVER_PORT "4389"
EXPOSE $LANGSERVER_PORT
EXPOSE 80 443
EXPOSE 22
# <<<<<<<<<<<<

# ADD supervisord.conf /etc/supervisor/conf.d/supervisord.conf

CMD ["/usr/bin/supervisord"]

# COPY ./build/docker/docker-entrypoint.sh /docker-entrypoint.sh
# RUN chmod +x /docker-entrypoint.sh
# SHELL ["/bin/bash"]
# ENTRYPOINT ["/entry/docker-entrypoint.sh"]
