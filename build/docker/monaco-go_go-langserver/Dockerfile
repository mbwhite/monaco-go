FROM mohamedbana/monaco-go:145a117

RUN apt-get install -qq -y  \
  supervisor \
  openssh-server
RUN mkdir -p \
  /var/run/sshd \
  /var/log/supervisor

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

ENV LOG_LANGSERVER_PATH="/var/log/monaco-go"
ENV LOG_LANGSERVER_FILE="go-langserver.log"
ENV LOG_LANGSERVER="$LOG_LANGSERVER_PATH/$LOG_LANGSERVER_FILE"

RUN \
  (mkdir -p $LOG_LANGSERVER_PATH && touch $LOG_LANGSERVER)
# RUN \
#   (ls -lah /Users/ && ls -lah /Users/mbana/) && \
#   (mkdir -p /Users/mbana/logs && touch /Users/mbana/logs/go-langserver.log) && \
#   (ls -lah /Users/ && ls -la /Users/mbana/)

# >>>>>>>>>>>>
# Expose ports
ENV LANGSERVER_PORT "4389"
EXPOSE $LANGSERVER_PORT 22
# <<<<<<<<<<<<

ADD ./build/docker/monaco-go_go-langserver/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
CMD ["/usr/bin/supervisord"]
