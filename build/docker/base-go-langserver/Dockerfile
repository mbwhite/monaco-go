FROM mohamedbana/base-langserver:latest

ENV GOLANG_VERSION 1.7.4
ENV GOLANG_DOWNLOAD_URL https://storage.googleapis.com/golang/go$GOLANG_VERSION.linux-amd64.tar.gz
ENV GOPATH $HOME/go
ENV GOROOT /usr/local/go

ENV PATH /usr/local/go/bin:$GOPATH/bin:/usr/local/bin:$PATH

# get go
RUN \
	mkdir -p $GOPATH && \
  curl -s $GOLANG_DOWNLOAD_URL | tar -C /usr/local -xz && \
  go version
