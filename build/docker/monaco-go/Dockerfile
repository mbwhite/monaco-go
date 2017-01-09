FROM mohamedbana/go-langserver:latest

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

# build monaco
RUN mkdir -p $HOME/monaco-go
COPY . $HOME/monaco-go
WORKDIR $HOME/monaco-go
RUN \
  source $NVM_DIR/nvm.sh; \
  ./build/all.sh

# create symlink of the GOPATH and see that
# that it works...
RUN \
  ln -s $GOPATH go; \
  ln -s /Users Users; \
  ls -lah ./go/src; \
  ls -lah ./Users; \
  ls -lah ./repos; \
  exit 0

ENV WEBSOCKET_PORT 4389
ENV LANGSERVER_ADDR ":$WEBSOCKET_PORT"
EXPOSE $WEBSOCKET_PORT

COPY ./build/docker/docker-entrypoint.sh /
RUN \
  chmod +x /docker-entrypoint.sh; \
  ls -lah /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD [ \
  "-r", "https://github.com/mbana/go-langserver.git", \
  "-p", "4389" \
]