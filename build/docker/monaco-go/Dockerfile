FROM mohamedbana/go-langserver:33d1174

ENV NVM_DIR $HOME/.nvm
ENV NODE_VERSION v7.0.0
ENV YARN_VERSION 0.17.8

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

##############
# build monaco
# VOLUME ["/Users/mbana/monaco-go"]
RUN mkdir -p $HOME/monaco-go
COPY . $HOME/monaco-go

WORKDIR $HOME/monaco-go
RUN \
  source $NVM_DIR/nvm.sh; \
  ./build/all.sh
##############

##############
# create symlink of the GOPATH and see that
# that it works...
RUN \
  ln -s $GOPATH go; \
  ln -s /Users Users; \
  ls -lah ./go/src; \
  ls -lah ./Users; \
  ls -lah ./repos; \
  exit 0
##############
