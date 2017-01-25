FROM mohamedbana/base-go-langserver:latest

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
  git checkout --track -b websocket-mode mbana/websocket-mode && \
  ls -lah langserver/cmd/langserver-go && \
  go get -x ./... && \
  git log -1

# build langserver
RUN \
  go build -race github.com/sourcegraph/jsonrpc2 && \
  go install -race github.com/sourcegraph/jsonrpc2 && \
  go build -race github.com/sourcegraph/go-langserver/langserver/cmd/langserver-go && \
  go install -race github.com/sourcegraph/go-langserver/langserver/cmd/langserver-go && \
  ls -lah `which langserver-go` && echo "done jsonrpc go-langserver"

# check langserver binary is ok
RUN \
  langserver-go --help; \
  exit 0
