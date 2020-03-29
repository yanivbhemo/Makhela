FROM python:3.7.7-slim-buster

RUN ln -fs /usr/share/zoneinfo/Asia/Jerusalem /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata 2>/dev/null

RUN apt update -y && \
        apt install git -y && \
        /bin/bash

CMD cd /tmp && \
        git clone https://github.com/yanivbhemo/Makhela.git && \
        cd Makhela && \
        git fetch --tags && \
        latestTag=$(git describe --tags `git rev-list --tags --max-count=1`) && \
        git checkout $latestTag && \
        cd /tmp/Makhela/collector && \
        pip3 install -q -r python_requirements.txt && \
        python3 main.py $run_type
