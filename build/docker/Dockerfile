#!/bin/bash -x

FROM ubuntu:14.04

SHELL ["/bin/bash", "-c"]

EXPOSE 8080

ENV DEBIAN_FRONTEND noninteractive

ENV CLICOLOR=1
ENV LSCOLORS=GxFxCxDxBxegedabagaced
ENV GREP_OPTIONS='--color=auto'

ENV HOME /root

ENV NVM_DIR $HOME/.nvm
ENV NODE_VERSION v7.0.0
ENV YARN_VERSION 0.17.8

ENV GOLANG_VERSION 1.7.4
ENV GOLANG_DOWNLOAD_URL https://storage.googleapis.com/golang/go$GOLANG_VERSION.linux-amd64.tar.gz
ENV GOPATH /go
ENV GOROOT /usr/local/go

ENV PATH /usr/local/go/bin:/go/bin:/usr/local/bin:$PATH

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

RUN curl -s $GOLANG_DOWNLOAD_URL | tar -C /usr/local -xz
RUN go version

RUN mkdir -p $HOME/monaco-go

COPY . $HOME/monaco-go
WORKDIR $HOME/monaco-go

RUN \
  source $NVM_DIR/nvm.sh; \
  ./build/all.sh

ENTRYPOINT ["/bin/bash", "-c", "source $NVM_DIR/nvm.sh; npm run serve"]