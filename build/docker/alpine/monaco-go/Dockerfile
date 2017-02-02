FROM golang:1.7-alpine3.5

RUN \
  (echo "root:docker.io" | chpasswd) && \
  echo "changed password to 'docker.io'"

# That will install curl running first apk update and then rm -rf /var/cache/apk/*
# for ssh config see
RUN apk --no-cache add \
  openssh \
  rsync \
  bash \
  git \
  nginx

# >>>>>>>>>>>>
RUN \
  ssh-keygen -A && \
	sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config && \
  echo 'root:docker.io' | chpasswd

EXPOSE 22
# <<<<<<<<<<<<

# >>>>>>>>>>>>
EXPOSE 80 443
EXPOSE 4389
# <<<<<<<<<<<<

# >>>>>>>>>>>>
ADD ./monaco-go/docker-entrypoint.sh /usr/sbin/docker-entrypoint.sh
RUN chmod +x /usr/sbin/docker-entrypoint.sh
ENTRYPOINT ["/usr/sbin/docker-entrypoint.sh"]
# <<<<<<<<<<<<
