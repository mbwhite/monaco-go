FROM ubuntu:14.04

SHELL ["/bin/bash", "-c"]

ENV HOME /Users/mbana
ENV DEBIAN_FRONTEND noninteractive
ENV CLICOLOR=1
ENV LSCOLORS=GxFxCxDxBxegedabagaced
ENV GREP_OPTIONS='--color=auto'

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
