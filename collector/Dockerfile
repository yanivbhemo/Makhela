FROM python:3.7.7-slim-buster

RUN echo "Asia/Jerusalem" > /etc/timezone && \
    dpkg-reconfigure --frontend noninteractive tzdata 2>/dev/null

RUN apt update -y && \
        apt install git && \
        pip install tweepy && \
        pip install bs4 && \
        pip install numpy && \
        pip install pymongo && \
        pip install dnspython

CMD cd /tmp && \
        git clone https://github.com/yanivbhemo/Makhela.git && \
        cd /tmp/Makhela/ && \