FROM ubuntu:14.04

SHELL ["/bin/bash", "-c"]

EXPOSE 8080

ENV DEBIAN_FRONTEND noninteractive

ENV CLICOLOR=1
ENV LSCOLORS=GxFxCxDxBxegedabagaced
ENV GREP_OPTIONS='--color=auto'

ENV HOME /Users/mbana

ENV NVM_DIR $HOME/.nvm
ENV NODE_VERSION v7.0.0
ENV YARN_VERSION 0.17.8

ENV GOLANG_VERSION 1.7.4
ENV GOLANG_DOWNLOAD_URL https://storage.googleapis.com/golang/go$GOLANG_VERSION.linux-amd64.tar.gz
ENV GOPATH $HOME/go
ENV GOROOT /usr/local/go

ENV PATH /usr/local/go/bin:$GOPATH/bin:/usr/local/bin:$PATH

RUN \
  echo America/Los_Angeles | sudo tee /etc/timezone && \
  sudo dpkg-reconfigure --frontend noninteractive tzdata

RUN \
  apt-get update -qq -y && \
  apt-get upgrade -qq -y

RUN apt-get install -qq -y  \
  software-properties-common \
  vim \
  curl \
  wget \
  gawk \
  sed \
  findutils \
  bc \
  less \
  htop \
  man \
  unzip \
  git \
  lsb-release \
  build-essential \
  make \
  python-all \
  libssl-dev \
  openssh-server \
  ca-certificates \
  g++ \
  gcc \
  libc6-dev \
  curl \
  mercurial \
  bzr \
  git-core

RUN wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.1/install.sh | /bin/bash
RUN source $NVM_DIR/nvm.sh; \
  nvm install $NODE_VERSION && \
  nvm alias default $NODE_VERSION && \
  nvm use default
RUN \
  source $NVM_DIR/nvm.sh; \
  echo "nvm: " `nvm --version` && \
  echo "node: " `node --version` && \
  echo "npm: " `npm --version`

ENV WEBSOCKET_PORT 4389
ENV LANGSERVER_ADDR ":$WEBSOCKET_PORT"

# get go
RUN mkdir -p $GOPATH
RUN curl -s $GOLANG_DOWNLOAD_URL | tar -C /usr/local -xz
RUN go version

# get langserver and its deps
RUN \
  go get -x github.com/sourcegraph/go-langserver/langserver/cmd/langserver-go && \
  cd $GOPATH/src/github.com/sourcegraph/go-langserver && \
  go get -x ./... && \
  git log -1
# use the branches of the fork
RUN \
	cd $GOPATH/src/github.com/sourcegraph/jsonrpc2 && \
  git remote add mbana https://github.com/mbana/jsonrpc2.git && \
  git fetch mbana && \
  git checkout --track -b jsonrpc-websocket-gorilla mbana/jsonrpc-websocket-gorilla && \
  git log -1
RUN \
	cd $GOPATH/src/github.com/sourcegraph/go-langserver && \
  git remote add mbana https://github.com/mbana/go-langserver.git && \
  git fetch mbana && \
  git checkout --track -b websocket-gorilla mbana/websocket-gorilla && \
  ls -lah langserver/cmd/langserver-{antha,go} && \
  go get -x ./... && \
  git log -1
# build langserver
RUN \
  go build -race github.com/sourcegraph/jsonrpc2 && \
  go install -race github.com/sourcegraph/jsonrpc2 && \
  go build -race github.com/sourcegraph/go-langserver/langserver/cmd/langserver-antha && \
  go install -race github.com/sourcegraph/go-langserver/langserver/cmd/langserver-antha && \
  ls -lah `which langserver-antha` && echo "done jsonrpc go-langserver"
# check langserver binary is ok
RUN \
  langserver-antha --help; \
  exit 0

# build monaco
RUN mkdir -p $HOME/monaco-go
COPY . $HOME/monaco-go
WORKDIR $HOME/monaco-go
RUN \
  source $NVM_DIR/nvm.sh; \
  ./build/all.sh

EXPOSE $WEBSOCKET_PORT

# create symlink of the GOPATH and see that
# that it works...
RUN \
  ln -s $GOPATH go; \
  ln -s /Users Users; \
  ls -lah ./go/src; \
  ls -lah ./Users; \
  ls -lah ./repos; \
  exit 0

COPY ./build/docker-entrypoint.sh /
RUN \
  chmod +x /docker-entrypoint.sh; \
  ls -lah /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD [ \
  "-r", "https://github.com/mbana/go-langserver.git", \
  "-p", "4389" \
]