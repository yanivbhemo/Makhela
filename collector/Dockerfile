FROM python:3.7.7-slim-buster

RUN ln -fs /usr/share/zoneinfo/Asia/Jerusalem /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata 2>/dev/null

RUN apt update -y && \
        apt install git -y && \
        pip install tweepy && \
        pip install bs4 && \
        pip install numpy && \
        pip install pymongo && \
        pip install dnspython

CMD cd /tmp && \
        git clone https://github.com/yanivbhemo/Makhela.git && \
        cd /tmp/Makhela/ && \
        /bin/bash