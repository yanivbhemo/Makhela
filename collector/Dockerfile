FROM alpine:latest

RUN apk update && \
        apk add python3 && \
        apk add git

RUN cd /tmp && \
        git clone https://github.com/yanivbhemo/Makhela.git && \
        cd /tmp/Makhela/ && \
        git pull