FROM python:3.7.7-slim-buster

RUN ln -fs /usr/share/zoneinfo/Asia/Jerusalem /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata 2>/dev/null

RUN apt update -y && \
        apt install git -y && \
        /bin/bash

CMD cd /tmp && \
        git clone https://github.com/yanivbhemo/Makhela.git && \
        cd /tmp/Makhela/ && \
        cd suggestion_collector && \
        pip3 install -r python_requirements.txt && \
        python3 main.py
