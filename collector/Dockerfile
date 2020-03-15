FROM alpine:latest

RUN apk update && \
        apk add python3 && \
        apk add git && \
        /bin/sh

CMD cd /tmp && \
        git clone https://github.com/yanivbhemo/Makhela.git && \
        cd /tmp/Makhela/ && \
        /bin/sh